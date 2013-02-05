chrome.devtools.network.onRequestFinished.addListener(
  function (request) {
    var div = document.createElement('div');
    div.innerHTML = JSON.stringify(request);
    document.body.appendChild(div);
    // if (request.response.bodySize > 40) {
      // alert('astoneuh');
            // chrome.experimental.devtools.console.addMessage(
                        // chrome.experimental.devtools.console.Severity.Warning,
                                // "Large image: " + request.request.url);
    // }
});
