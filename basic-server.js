var http = require("http");
var connect = require("connect");
var handler = require("./request-handler");
var path = require("path");

var port = 8080;
var ip = "127.0.0.1";
// var server = http.createServer(handler.handleRequest);
var app = connect()
          .use(connect.static(path.join(__dirname,'public')))
          .use(handler.handleRequest);
var server = http.createServer(app);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);