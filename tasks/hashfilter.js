var path = require("path"),
_ = require('lodash'),
crypto = require('crypto');

module.exports = function(grunt) {

	grunt.registerMultiTask("hashfilter","takes a list of files and filters out those that have [not] been altered", function() {

		var options = this.options({
			exist: true,
			tmp: "/tmp"
		});

		var filepath = path.join(options.tmp, this.target + '.hashfilter.json');

		// create the place to store the final lists
		var files = grunt.config.data.hashfilter.files[this.target] || {};
		var hashes = grunt.config.data.hashfilter.hashes[this.target] || {};
		var removed = grunt.config.data.hashfilter.removed[this.target] || {};
		
		// hash the files that we were given to snoop in on
		for(var key in this.data) if(this.data.hasOwnProperty(key)) {
			var data = grunt.file.expand(this.data[key]);
			var src = '';

			if(_.isArray(data)) {
				// simple concat
				src = data.map(function(filepath) {
					return grunt.file.read(filepath); 
				}).join(grunt.util.linefeed);
			} else {
				// single file
				src = grunt.file.read(data);
			}
			var hash = crypto.createHash('md5').update(src,'utf8').digest('hex').slice(0,8);

			// save the files
			files[key] = data;
			hashes[key] = hash;
		}

		// check for a previous listing and compare
		var previous = grunt.file.exists( filepath );
		if(previous) {
			previous = JSON.parse(grunt.file.read( filepath ));
		}
		if (previous && previous.hashes) {

			// create a diff and save the file difference
			// clone so the loop isn't being destroyed during delete step
			var clonedFiles = _.cloneDeep(files);
			for(var key in clonedFiles) {
				// if the previous has hash that matches current, then it's been cached
				// grunt.verbose.ok(key, previous.hashes[key], hashes[key]);
				if(previous.hashes[key] === hashes[key]) {
					// save what we are dropping
					removed[key] = files[key];
					delete files[key];
				}
			}

			// write to the previous file with the new code
			grunt.file.write(filepath, JSON.stringify({ hashes: hashes, files: clonedFiles, removed: removed }));
		} else {
			// grunt.verbose.ok(JSON.stringify(files));
			// just save the current as the previous
			grunt.file.write(filepath, JSON.stringify({ hashes: hashes, files: files, removed: removed }));
		}

		// confirm files are saved in paths
		grunt.config.data.hashfilter.files[this.target] = files;
		grunt.config.data.hashfilter.hashes[this.target] = hashes;
		grunt.config.data.hashfilter.removed[this.target] = removed;

		// grunt.verbose.ok(JSON.stringify(files), "\n\n" +JSON.stringify(hashes), "\n\n" +JSON.stringify(removed));
		return files
	});
};