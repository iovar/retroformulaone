var audio = {
  markers: [
    [0, 1], //roll
    [2,3], //move
    [4,5], //lose life
    [6,8], //game over
    [9,13] //game win
  ],
  buffer: null,
  nextMarker: 0,
  load: function() {
    audio.buffer = new Audio('audio/sounds.mp3');
    audio.buffer.addEventListener("timeupdate", function() {
      if(audio.buffer.currentTime > audio.nextMarker) {
        audio.buffer.pause();
      }
    });
  },
  play: function(sound) {
    if(audio.buffer === null) {
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
