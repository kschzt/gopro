var when = require('when')
var Camera = require('../index').Camera
var fsPath = require('path')
var fs = require('fs')

var camera = new Camera('10.5.5.9', 'jambikassu')

function sleep(ms) {
	var dfd = when.defer()
	setTimeout(dfd.resolve.bind(dfd), ms)
	return dfd.promise
}

function snap() {
	return camera.startCapture()
	.then(function() {
		return sleep(600)
		.then(function() {
			return camera.stopCapture()
		})
	})
}

function getImage(fromPath, toPath) {
	console.log('retrieving image',fromPath, toPath)
	return camera.get(fromPath)
	.then(function(stream) {
		var dfd = when.defer()
		var out = fs.createWriteStream(toPath)
		out.on('error', dfd.reject.bind(dfd))

		stream.pipe(out)
		stream.on('error', dfd.reject.bind(dfd))
		out.on('finish', function() {
			console.log('done retrieving image',fromPath, toPath)
			dfd.resolve()
		})
		return dfd
	})
}

function mirror(fromPath, toPath) {
	return camera.ls(fromPath).then(function(paths) {
		return when.map(paths, function(path) {
			var src = fsPath.join(fromPath, path.name)
			var dest = fsPath.join(toPath, path.name)
			if (path.isFolder)
				return mirror(src, dest)

			return getImage(src, new Date().getTime()+'.jpg')
		})
	})
}

function snapGetAndDelete() {
	return snap()
	.then(function() {
		return sleep(500)
	})
	.then(function() {
		return mirror('/DCIM', process.cwd())
	})
	.then(function() {
		return camera.erase()
	})
}

snapGetAndDelete()
	.otherwise(function(e) {
		console.error(e.stack || e)
		throw e
	})

