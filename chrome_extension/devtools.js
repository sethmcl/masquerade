chrome.devtools.panels.create('Masquerade', '', 'panel/panel.html', function (panel) {
  console.log(panel);
});
var config = {
  mode: 'fixed_servers',
  rules: {
    proxyForHttp: {
      scheme: 'http',
      host: '127.0.0.1',
      port: 8181
    }
  }
};

chrome.proxy.settings.set(
  { value: config, scope: 'regular' },
  function () {}
);
