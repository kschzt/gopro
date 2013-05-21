var asPromise = require('when/node/function')
var request = require('request')

function Camera(ip, password, _requestImpl) {
	this._request = _requestImpl || request
	this._password = password
	this._apiUrl = 'http://'+ip+'/camera/'
	this._webUrl = 'http://'+ip+':8080/'
}

Camera.prototype.apiCall = function(method, intParam) {
	var parameter = ''

	if (intParam !== undefined)
		parameter = '&p=%0' + intParam

	return asPromise.call(this._request, this._apiUrl + method +
		'?t=' + this._password + parameter)
}

Camera.prototype.startCapture = function() {
	return this.apiCall('SH', 1)
}

Camera.prototype.stopCapture = function() {
	return this.apiCall('SH', 0)
}

Camera.prototype.deleteLast = function() {
	return this.apiCall('DL')
}

Camera.prototype.deleteAll = function() {
	return this.apiCall('DA')
}

Camera.prototype.erase = function() {
	return this.deleteAll()
}

exports.Camera = Camera
