
window.addEventListener('load', function() {
  FastClick.attach(document.body);
  if(window.cordova) {
    document.addEventListener('deviceready', function() {
      controller.setup(game);
      audio.load();
    }, false);
  }
  else {
    controller.setup(game);
    audio.load();
  }
},false);
