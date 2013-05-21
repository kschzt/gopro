var when = require('when')
var poll = require('when/poll')
var request = require('request')

var cheerio = require('cheerio')

var fsPath = require('path')

function Camera(ip, password, _requestImpl) {
	this._request = _requestImpl || request
	this._password = password
	this._apiUrl = 'http://'+ip
	this._webUrl = 'http://'+ip+':8080'
}

Camera.prototype._cameraApi = function(method, intParam) {
	return this._apiCall('camera', method, intParam)
}

Camera.prototype._bacpacApi = function(method, intParam) {
	return this._apiCall('bacpac', method, intParam)
}

Camera.prototype._apiCall = function(api, method, intParam) {
	var dfd = when.defer()
	var parameter = ''

	if (intParam !== undefined)
		parameter = '&p=%0' + intParam

	var url = [this._apiUrl, api, method].join('/') +
		'?t=' + this._password + parameter

	console.log(url)
	this._request(url, function(err, res, body) {
		if (err) return dfd.reject(err)
		return dfd.resolve(res)
	})

	return dfd.promise
}

Camera.prototype.status = function() {
	return this._bacpacApi('se')
	.then(function(res) {
		if (res.statusCode != 200)
			return when.reject('Error '+res.statusCode+': '+body)

		// help! @gopro tell us!
		var status = {
			ready: res.body[15].charCodeAt(0) === 1
		}

		for (var i=0; i < res.body.length; i++) {
			console.log('status byte '+i, res.body[i].charCodeAt(0))
		}

		return status
	})
}

Camera.prototype.whenReady = function() {
	var that = this

	return poll(
		that.status.bind(that),
		500,
		function(status) {
			return status.ready
		}
	)
}

Camera.prototype.powerOn = function() {
	return this._bacpacApi('PW', 1)
}

Camera.prototype.powerOff = function() {
	return this._bacpacApi('PW', 0)
}

Camera.prototype.startBeeping = function() {
	return this._cameraApi('LL', 1)
}

Camera.prototype.stopBeeping = function() {
	return this._cameraApi('LL', 0)
}

Camera.prototype.startCapture = function() {
	return this._cameraApi('SH', 1)
}

Camera.prototype.stopCapture = function() {
	return this._cameraApi('SH', 0)
}

Camera.prototype.deleteLast = function() {
	return this._cameraApi('DL')
}

Camera.prototype.deleteAll = function() {
	return this._cameraApi('DA')
}

Camera.prototype.erase = function() {
	return this.deleteAll()
}

Camera.prototype.ls = function(path) {
	var dfd = when.defer()
	var url = this._webUrl + (path || '')
	var files = []

	this._request(url, function(e, res, body) {
		if (e || res.statusCode !== 200)
			return dfd.reject(e.stack || e || res.statusCode)

		var $ = cheerio.load(body)

		$('table tbody tr').each(function() {
			var name = $(this).find('a.link').attr('href')
			var date = $(this).find('span.date').text()
			var size = $(this).find('span.size').text()
			files.push({
				name: name,
				isFolder: name[name.length-1] === '/',
				time: new Date(date),
				size: size !== '-' ? size : null
			})
		})

		dfd.resolve(files)
	})

	return dfd.promise
}

Camera.prototype.get = function(path) {
	var url = this._webUrl + (path || '')
	return when.resolve(this._request(url))
}

exports.Camera = Camera
