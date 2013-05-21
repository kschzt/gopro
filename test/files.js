var assert = require('assert')
var fs = require('fs')
var Camera = require('../index').Camera

var ip = '127.0.0.1'
var pw = 'foo'

function fail(e) {
	console.error(e.stack || e)
	throw e
}

describe('http', function() {
	it('can parse /DCIM folder', function(done) {
		function res(url, cb) {
			return cb(null, {statusCode: 200},
				fs.readFileSync(__dirname+'/fixtures/dcim.html').toString('utf8')
			)
		}

		var c = new Camera(ip, pw, res)
		c.ls()
		.then(function(files) {
			assert.equal(files[0].name, '107GOPRO/')
			assert.equal(files[0].isFolder, true)
			assert.equal(files[0].size, null)
			done()
		})
		.otherwise(fail)
	})

	it('can parse image folder', function(done) {
		function res(url, cb) {
			return cb(null, {statusCode: 200},
				fs.readFileSync(__dirname+'/fixtures/folder.html').toString('utf8')
			)
		}

		var c = new Camera(ip, pw, res)
		c.ls()
		.then(function(files) {
			assert.equal(files[0].isFolder, false)
			assert.equal(files[0].name, 'G0011760.JPG')
			assert.equal(files[1].name, 'G0011761.JPG')
			assert.equal(files[2].name, 'G0021762.JPG')
			done()
		})
		.otherwise(fail)
	})

	it('can retrieve a file', function(done) {
		function res(url, cb) {
			return fs.createReadStream(__dirname+'/fixtures/folder.html')
		}

		var c = new Camera(ip, pw, res)
		c.get('file://'+__dirname+'/fixtures/folder.html')
		.then(function(stream) {
			stream.on('data', function() {
				done()
			})
		})
		.otherwise(fail)
	})

})

