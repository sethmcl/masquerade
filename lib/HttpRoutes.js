/*jslint node: true*/
// @author Seth McLaughlin

'use strict';

function HttpRoutes() {}

HttpRoutes.prototype.init = function (app) {
  app.get('/', this.root);
};

HttpRoutes.prototype.root = function (request, response) {
  response.render('index', { hostname: 'foo' });
};

module.exports = HttpRoutes;
Object.seal(module);



