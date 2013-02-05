/*jslint node: true*/
// @author Seth McLaughlin

var http = require('http'),
    fs   = require('fs');

function Proxy() {}

// Start the proxy
Proxy.prototype.init = function (port, rules) {

  console.log('Starting proxy on port', port);

  this.rules = rules || [];

  http.createServer(function (request, response) {
    var alternateResource = this.getAlternateResource(request);

    if (alternateResource) {
      console.log('replacing content');
      response.end(alternateResource);
    } else {
      console.log('pass through');
      this.passThrough(request, response);
    }

  }.bind(this)).listen(port);

};

// Get alternate resource for a request
Proxy.prototype.getAlternateResource = function (request) {
  var url = request.url,
      rules = this.rules,
      resource;

  console.log(rules);

  rules.forEach(function (rule) {

    if (new RegExp(rule.url).test(url)) {
      resource = this.loadResource(rule.localFile);
      return false;
    }
  }, this);

  return resource;
};

// Load a resource
Proxy.prototype.loadResource = function (path) {
  var file = fs.readFileSync(path);
  return file.toString();
};

Proxy.prototype.passThrough = function (request, response) {
  var proxyClient = http.createClient(80, request.headers['host']),
      proxyRequest = proxyClient.request(request.method, request.url, request.headers);

  proxyRequest.addListener('response', function (proxyResponse) {
    proxyResponse.addListener('data', function (chunk) {
      response.write(chunk, 'binary');
    });

    proxyResponse.addListener('end', function () {
      response.end();
    });

    response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
  });

  request.addListener('data', function (chunk) {
    proxyRequest.write(chunk, 'binary');
  });

  request.addListener('end', function () {
    proxyRequest.end();
  });
};

module.exports = Proxy;
Object.seal(module.exports);
