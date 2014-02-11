var helpers = require('./http-helpers');

exports.handleRequest = function (req, res) {
  if(req.method === "GET"){
    url = req.url.replace(/^\//, "");
    helpers.serveAssets(res,url);
  }else if(req.method === "POST"){
    var data = "";
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      // log comment in mongo.
    });
  }
  // else if(req.method === "OPTIONS"){
  //   res.writeHead(helpers.headers);
  //   res.end();
  // }
};