var Camera = require('../index').Camera

new Camera('10.5.5.9', 'jambikassu')
.erase()
.then(function() {
	console.log('Camera erased successfully')
})
.otherwise(function(e) {
	console.error(e.stack || e)
})
