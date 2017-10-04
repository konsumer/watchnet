# watchnet

An application to watch TCP network traffic.


## installation

Make sure you have libpcap headers installed.

- **Debian**: `apt install libpcap-dev`
- **OSX**: `brew install libpcap`

Now, run `npm i`.

## usage

`npm start` and visit [webpage](http://0.0.0.0:8000/).

### environment variables

* `WATCHNET_DEV` - The name of the devie you'd like to listen to, if it's not the primary interface.
* `WATCHNET_COUNT` - The max number of packets to keep track of
