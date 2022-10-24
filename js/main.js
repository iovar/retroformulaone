import { audio } from './audio.js'
import { game } from './game.js'

window.addEventListener('load', function() {
    controller.setup(game);
},false);

let soundsLoaded = false;
const listerner = addEventListener('touchstart', function(e) {
  if(!soundsLoaded) {
    audio.load();
    soundsLoaded = true;
    removeEventListener('touchstart', listerner);
  }
});
