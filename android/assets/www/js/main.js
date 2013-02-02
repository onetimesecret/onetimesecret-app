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
            data: {'secret':secret,'ttl':ttl},
            dataType: 'json',
            success: function(res) {
              var key = res['secret_key']
              var secret_ttl = parseInt(res['secret_ttl'] / (3600*24))
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


