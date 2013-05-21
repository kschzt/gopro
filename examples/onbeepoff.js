var when = require('when')
var poll = require('when/poll')
var Camera = require('../index').Camera

var cam = new Camera('10.5.5.9', 'jambikassu')

cam
.powerOn()
.then(function() {
	return cam.whenReady()
	.then(function() {
		return cam.startBeeping()
	})
})
.then(function() {
	var dfd = when.defer()
	cam.status()
	setTimeout(function() {
		cam.stopBeeping()
		.then(function() {
			dfd.resolve()
		})
	}, 5000)
	return dfd.promise
})
.then(function() {
	return cam.powerOff()
})
.otherwise(function(e) {
	console.error(e.stack || e)
})
