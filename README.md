gopro.js
========

API for controlling GoPro Hero 3 Camera from Node.js

The initial mission here is to take, retrieve, and remove timelapse photos with/from the camera.

### Usage

```javascript
  var Camera = require('gopro').Camera
  var cam = new Camera('10.5.5.9', 'camera password')
  
  cam.startCapture()
  .then(function() {
    cam.stopCapture()
  })
```
