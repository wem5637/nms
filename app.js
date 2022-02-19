const NodeMediaServer = require('node-media-server');
const express = require('express');
const fs = require('fs');
const cors = require('cors')
const app = express();
const http = require('http');
const https = require('https');
const options = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
};
app.use(cors())
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);
const { Server } = require("socket.io");
const io = new Server(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let streamChannel = null;
app.get('/', (req, res) => {
  res.json({channel: streamChannel});
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('switch_stream', (name)=>{
    streamChannel = name
    io.emit('switch_stream', name)
  })
});


httpServer.listen(8080, () => {
  console.log('listening http on *:8080');
});
httpsServer.listen(8443, () => {
  console.log('listening https on *:8443');
});

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  https: {
    port: 7080,
    allow_origin: '*',
    key: './privkey.pem',
    cert: './fullchain.pem'
  },
  http: {
    port: 7000,
    mediaroot: './media',
    allow_origin: '*'
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        vc: "copy",
        vcParam: [],
        ac: "aac",
        acParam: ['-ab', '64k', '-ac', '1', '-ar', '44100'],
        rtmp:true,
        rtmpApp:'live2',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

var nms = new NodeMediaServer(config)
nms.run();

nms.on('postPublish', (id, StreamPath, args) => {
  io.sockets.emit('refetch')
});

nms.on('postConnect', (id, args) => {
  io.sockets.emit('refetch')
});
