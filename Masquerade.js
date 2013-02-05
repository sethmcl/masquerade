/*jslint node: true*/
// @author Seth McLaughlin

// Dependencies
var path        = require('path'),
    http        = require('http'),
    express     = require('express'),
    consolidate = require('consolidate'),

    HttpRoutes  = require('./lib/HttpRoutes'),
    Proxy       = require('./lib/Proxy'),
    proxyRules  = require('./rules');

// The application object
function Masquerade() {

  // Default port
  this.port = 3015;
}

// Start the application
Masquerade.prototype.run = function () {
  this.app = this.initHttpServer();
  this.proxy = new Proxy();
  this.start(this.app, this.port);
};

// Initialize Http Masquerade
Masquerade.prototype.initHttpServer = function () {
  var app        = this.app = express(),
      homeFolder = path.resolve(__dirname, 'webui');

  // express config
  app.engine('tl', consolidate.dust);
  app.set('view engine', 'tl');
  app.set('views', homeFolder + '/views');
  app.set('views');
  app.set('view options', { layout: null });

  // Setup post request body data
  app.use(function (req, res, next) {
      var data = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        data += chunk;
      });

      req.on('end', function () {
          req.body = data;
          next();
        });
    });

  // static resources
  app.use('/js', express['static'](homeFolder + '/js'));
  app.use('/css', express['static'](homeFolder + '/css'));
  app.use('/img', express['static'](homeFolder + '/img'));
  app.use('/temp', express['static'](homeFolder + '/temp'));

  // Setup Routes
  new HttpRoutes().init(app);

  return app;
};

// Start the application
Masquerade.prototype.start = function (app, port) {
  http.createServer(app).listen(port);
  this.proxy.init(8181, proxyRules);
};

module.exports = Masquerade;
Object.seal(module.exports);
