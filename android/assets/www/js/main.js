
// Based on:
//    https://github.com/phonegap/phonegap-plugins/tree/master/Android/ClipboardManager
// Modified for Cordova 2 from:
//    http://ambrusmartin.wordpress.com/2012/09/17/cordova-2-0-broken-vs-resolved/
var ClipboardManager = function() {
}

var clipboardManager = {
  copy: function(key, success, fail){
    cordova.exec(success, fail, "clipboardManager", "copy", [key]);
  },
  paste: function(success, fail){
    cordova.exec(success, fail, "clipboardManager", "paste", []);
  }
}

var tmp;
var app = {
    // Application Constructor
    initialize: function() {
      this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);

      $("#showMetadata button").on("click",function(e) {
        tmp = e;
        clipboardManager.copy(
          "the text to copy",
          function(r){alert("copy is successful")},
          function(e){alert(e)}
        );
        return e.preventDefault();
      });
      $("#createSecret").on("submit",function(e) {
        var secret = $("#createSecret textarea").val();
        if ("" == secret) {
          app.alert("You must type something.")
        } else {
          $("#createSecret button").attr("disabled", "disabled");
          var url = "https://onetimesecret.com/api/v1/share";
          var ttl = 3600*48;
          $.ajax({
            type: 'POST',
            url: url,
            data: {'secret':secret,'ttl':ttl,src:'app'},
            dataType: 'json',
            success: function(res) {
              var key = res['secret_key']
              var secret_ttl = parseInt(res['ttl'] / (3600*24)) // ttl is always a whole number
              var secret_uri = app.createSecretURI(key)
              $("#createSecret").hide();
              $("#showMetadata").show();
              $("#showMetadata .secret-uri").val(secret_uri);
              $("#showMetadata .secret-ttl").text(secret_ttl);
              $("#createSecret button").removeAttr("disabled");
            },
            error: function(res) {
              app.alert("Request failed");
              $("#createSecret button").removeAttr("disabled");
            }
          });
        }
        return e.preventDefault();
      });

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      //var parentElement = document.getElementById(id);
      //var listeningElement = parentElement.querySelector('.listening');
      //var receivedElement = parentElement.querySelector('.received');
      //
      //listeningElement.setAttribute('style', 'display:none;');
      //receivedElement.setAttribute('style', 'display:block;');

      console.log('Received Event: ' + id);
    }
};

app.debug = function(msg) {
  if (typeof(navigator.notification) == "undefined") {
    console.log(msg);
  } else {
    //navigator.notification.vibrate(200)
    navigator.notification.alert(msg, function() {});
  }
}

app.alert = function(msg) {
  if (typeof(navigator.notification) == "undefined") {
    alert(msg);
  } else {
    navigator.notification.alert(msg, function() {});
  }
}

app.createSecretURI = function(key) {
  var uri = this.parseURI('');
  uri.protocol = 'https:';
  uri.hostname = 'onetimesecret.com';
  uri.pathname = '/secret/' + key;
  console.log(uri);
  return uri;
}

app.parseURI = function(uri) {
  var parser = window.document.createElement('a');
  parser.href = uri;
  return parser;
}

