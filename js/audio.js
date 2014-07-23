var audio = {
  markers: [
    [0,0.3], //roll
    [2,2.3], //move
    [4,4.3], //lose life
    [6,7.6], //game over
    [9,12.6] //game win
  ],
  ready: false,
  buffer: null,
  nextMarker: 0,
  load: function() {
    if(audio.buffer === null) {
      audio.buffer = new Audio('audio/sounds.mp3');
    }
    audio.buffer.load();
    audio.buffer.addEventListener("timeupdate", function() {
      if(audio.buffer.currentTime > audio.nextMarker) {
        audio.buffer.pause();
      }
    });
  },
  play: function(sound) {
    if(!audio.ready) {
      audio.ready = true;
      audio.load();
      return;
    }
    else if (audio.buffer && audio.buffer.readyState !==4) {
      return;
    }
    var limits = null;
    switch(sound) {
      case 'roll':
        limits = audio.markers[0];
        break;
      case 'move':
        limits = audio.markers[1];
        break;
      case 'crash':
        limits = audio.markers[2];
        break;
      case 'die':
        limits = audio.markers[3];
        break;
      case 'win':
        limits = audio.markers[4];
        break;
      default:
        limits = [0,0];
    }
    audio.buffer.currentTime = limits[0];
    audio.nextMarker = limits[1];
    audio.buffer.play();
  }

};
