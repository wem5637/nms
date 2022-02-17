https://tmuxcheatsheet.com/

play a static video
ffmpeg -re -i '10 second lens pack opening video-9HRjopTKNC8.mp4' -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://localhost/live/stream1

loop a static video
ffmpeg -stream_loop -1 -re -i '10 second lens pack opening video-9HRjopTKNC8.mp4' -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://localhost/live/stream1

obs
rtmp://64.227.30.198:1935/live

to do:
ssl cert
make sure socket and events are working correctly
connect multiple obs livestreams
see if transmuxing is necessary
