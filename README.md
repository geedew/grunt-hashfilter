# Grunt-Hashfilter
The input is a list of files; the output is a list of files. The first input is filtered by the hash of the source of the file. If the file has been seen previously, then the file is removed from the file object.

Best case for this is to easily parse down files that you don't want to run through the processes you have setup based on a simple md5 hash of their input.

# Install (**requires grunt 0.4+**)

## Via NPM
```
$> npm install grunt-hashfilter
```
