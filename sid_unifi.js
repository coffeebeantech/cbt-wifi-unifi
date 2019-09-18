/*jshint esversion: 6 */

var parameters = {
  // set your captive portal login url here. Ex: "https://wifi.socialidnow.com/portals/cbt-ubnt-unifi-lab"
  sidPortal: null,
  // html element to display errors
  errorsContainerName: "error_message"
}

var SidUnifi = function(parameters) {
  var ErrorViewer = function(containerName) {
    var container;

    if (containerName) {
      container = document.getElementById(containerName);
    }

    function showError(message) {
      if (container) {
        container.innerHTML = message;
      }
    }

    return {
      showError: showError
    }
  }

  function getQueryParams(parameterName) {
    var result = null,
      tmp = [];
    var items = location.search.substr(1).split("&");

    for (var index = 0; index < items.length; index++) {
      tmp = items[index].split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }

    return result;
  }

  function serialize(params) {
    return Object.entries(params).
      filter(function([key, val]) { return val; }).
      map(function([key, val]) { return key + '=' + encodeURIComponent(val); }).
      join('&');
  }

  function buildLoginPath() {
    var params = {
      ap: getQueryParams("ap"),
      id: getQueryParams("id"),
      ssid: getQueryParams("ssid"),
      url: getQueryParams("url"),
      t: getQueryParams("t"),
      login_url: 'http://' + window.location.host + window.location.pathname + 'signin.html'
    };

    return "/auth?" + serialize(params);
  }

  function redirectToPortal() {
    if (!parameters.sidPortal) {
      errorViewer.showError("Please set your sidPortal parameter in sid_unifi.js file");
      return;
    }

    var path = buildLoginPath();
    window.location.href = parameters.sidPortal + path;
  }

  function performRadiusLogin() {
    var data = getQueryParams("data");

    // validate parameters
    if (!parameters.sidPortal) {
      errorViewer.showError("Please set your sidPortal parameter in sid_unifi.js file");
      return;
    }

    if (!data) {
      errorViewer.showError("Missing required parameter: data");
      return;
    }

    try {
      data = JSON.parse(atob(data));
    } catch (err) {
      errorViewer.showError("Invalid required parameter: data");
      return;
    }

    // create xhr request
    var payload = {
      by: 'radius',
      username: data.username,
      password: data.password,
    };
    var redirect = parameters.sidPortal + "#/fail";
    var xhr = new XMLHttpRequest();

    // configure xhr request
    xhr.open("POST", "login", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onload = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var resp = JSON.parse(xhr.responseText);
          if (resp.data.length > 0) {
            redirect = data.continue_url; //success
          }
          window.location = redirect;
        }
      }
    };

    // perform xhr request
    try {
      var resp = xhr.send(JSON.stringify(payload));
    } catch (err) {
      window.location = redirect;
    }
  }

  var errorViewer = new ErrorViewer(parameters.errorsContainerName);

  return {
    redirectToPortal: redirectToPortal,
    performRadiusLogin: performRadiusLogin
  }
}
