var assert = require('assert')
var Camera = require('../index').Camera

var ip = '127.0.0.1'
var pw = 'foo'

function fail(e) {
	console.error(e.stack || e)
	throw e
}

describe('Camera', function() {
	var root = 'http://'+ip+'/camera/'

	function shouldMatchUrl(matchUrl) {
		return function(url, cb) {
			assert.equal(matchUrl, url)
			cb()
		}
	}

	it('can start capture', function(done) {
		new Camera(ip, pw,
			shouldMatchUrl(root+'SH?t='+pw+'&p=%01'))
		.startCapture().then(done)
	})

	it('can stop capture', function(done) {
		new Camera(ip, pw,
			shouldMatchUrl(root+'SH?t='+pw+'&p=%00'))
		.stopCapture().then(done)
	})

	it('can delete last item', function(done) {
		new Camera(ip, pw,
			shouldMatchUrl(root+'DL?t='+pw))
		.deleteLast().then(done)
	})

	it('can erase the camera', function(done) {
		new Camera(ip, pw,
			shouldMatchUrl(root+'DA?t='+pw))
		.deleteAll().then(done)
	})

})


