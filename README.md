gopro
========

API for controlling GoPro Hero 3 Camera from Node.js.

The initial mission here is to take, retrieve, and remove timelapse photos with/from the camera.

As there is no public API, this work is based on these reverse engineering efforts:
- http://forums.openpilot.org/topic/15545-gcs-go-pro-wifi-widget/
- http://superuser.com/questions/546628/can-i-transfer-files-from-to-gopro-3-to-my-pc-over-wifi
- http://goprouser.freeforums.org/howto-livestream-to-pc-and-view-files-on-pc-smartphone-t9393.html

### Issues

- The status bytes at least as given by my Hero3 White are totally unknown. The status() method assumes that byte 15 is ready status.

### Usage

```javascript
  var Camera = require('gopro').Camera
  var cam = new Camera('10.5.5.9', 'camera password')
  
  cam.startCapture()
  .then(function() {
    cam.stopCapture()
  })
```

See also the examples folder and tests.

