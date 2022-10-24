import { game } from './game.js'
import { controller } from './controller.js'

window.addEventListener('load', function() {
    controller.setup(game);
},false);

