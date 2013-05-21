var when = require('when')
var Camera = require('../index').Camera

var cam = new Camera('10.5.5.9', 'jambikassu')

cam
.status()
.then(function(status) {
	console.log('camera status',status)
})
.otherwise(function(e) {
	console.error(e.stack || e)
})
