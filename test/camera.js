var assert = require('assert')
var Camera = require('../index').Camera

var ip = '127.0.0.1'
var pw = 'foo'

function fail(e) {
	console.error(e.stack || e)
	throw e
}

describe('Camera', function() {
	var bacUrl = 'http://'+ip+'/bacpac/'
	var camUrl = 'http://'+ip+'/camera/'

	function shouldMatchUrl(matchUrl) {
		return function(url, cb) {
			assert.equal(matchUrl, url)
			cb()
		}
	}

	function expect(method, url, done) {
		new Camera(ip, pw, shouldMatchUrl(url))
		[method]().then(done).otherwise(fail)
	}

	it('can retrieve camera status', function(done) {
		var req = function(url, cb) {
			return cb(null, {
				statusCode: 200,
				body: 'xxxxxxxxxxxxxxx\u0001'
			})
		}
		new Camera(ip, pw, req).status()
		.then(function(status) {
			assert.ok(status.ready)
			done()
		}).otherwise(fail)
	})

	it('can turn camera on', function(done) {
		expect('powerOn', bacUrl+'PW?t='+pw+'&p=%01', done)
	})

	it('can turn camera off', function(done) {
		expect('powerOff', bacUrl+'PW?t='+pw+'&p=%00', done)
	})

	it('can turn locator on', function(done) {
		expect('startBeeping', camUrl+'LL?t='+pw+'&p=%01', done)
	})

	it('can turn locator off', function(done) {
		expect('stopBeeping', camUrl+'LL?t='+pw+'&p=%00', done)
	})

	it('can start capture', function(done) {
		expect('startCapture', camUrl+'SH?t='+pw+'&p=%01', done)
	})

	it('can stop capture', function(done) {
		expect('stopCapture', camUrl+'SH?t='+pw+'&p=%00', done)
	})

	it('can delete last item', function(done) {
		expect('deleteLast', camUrl+'DL?t='+pw, done)
	})

	it('can erase the camera', function(done) {
		expect('erase', camUrl+'DA?t='+pw, done)
	})

})

