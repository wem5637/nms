const NodeMediaServer = require('node-media-server');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

let streamChannel = null;
app.get('/', (req, res) => {
  res.json({channel: streamChannel});
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('switch_stream', (name)=>{
  streamChannel = name
  io.sockets.emit('switch_stream', streamChannel)
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
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
