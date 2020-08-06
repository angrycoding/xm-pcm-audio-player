# xm-pcm-audio-player

Plays PCM audio recorded from DVRIP stream (NAL - frames), or RTSP from XM ip cameras.

# installation

```npm install```

# play locally

Just open index.html in the browser and click "Play prerecorded sample", this will start playing
prerecorded audio sample (see index.html), previously obtained from DVRIP protocol stream or from
archive .h264 file.

# play rtsp

Open server.js and change RTSP url used to connect to your camera.
Make sure that audio stream is enabled on your camera, server doesnt check stream presense nor
handling any kind of exceptions. So if you'll here some rubish instead of audio from camera,
then you've probably listening video stream instead of audio, if so try to swap trackID=3 and trackID=4
(server doesnt read sdp and doesnt know which of the streams is actual audio track).

Run server: ```node server.js```

Open browser http://localhost:9999/ and click "Play live". Server grabs PCM data from RTSP stream of your camera,
then forwards it to socket.io connection. Web browser receives the data and plays it in absolutelly the same
manner as it comes to place with the prerecorded fragments as it's described previously.

Have fun!
