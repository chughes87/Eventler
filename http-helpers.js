var fs = require('fs');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/html"
};

exports.sendResponse = sendResponse = function(response, object, status){
  console.log('sending Response');
  status = status || 200;
  response.writeHead(status, headers);
  response.end(JSON.stringify(object));
};

exports.serveAssets = function(res, asset) {
  if(asset === ''){
    console.log('serving root');
    fs.readFile('index.html', function(err, data){
      sendResponse(res, data, 200);
    });
  }else{
    sendResponse(res, "", 404);
    console.log("asset not found!: "+asset);
  }
};
