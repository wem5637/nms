https://tmuxcheatsheet.com/

~play a static video~
ffmpeg -re -i '10 second lens pack opening video-9HRjopTKNC8.mp4' -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://localhost/live/stream1

~loop a static video~
ffmpeg -stream_loop -1 -re -i 'Secret Mortal Kombat 3 Character Select Screen-UcrBvM2EJis.mp4' -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://localhost/live/stream

~obs~
rtmp://64.227.30.198:1935/live
rtmp://teeveedrop.com:1935/live

~from nms github - ssl cert directions for self signed cert~
openssl genrsa -out privkey.pem 1024
openssl req -new -key privkey.pem -out certrequest.csr
openssl x509 -req -in certrequest.csr -signkey privkey.pem -out fullchain.pem

~run certbot~
sudo certbot certonly --standalone -v

~to do~
make sure socket and events are working correctly
connect multiple obs livestreams
see if transmuxing is necessary
