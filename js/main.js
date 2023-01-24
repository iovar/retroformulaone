import { Game } from './game.js'
import { Controller } from './controller.js'

window.addEventListener('load', function() {
    const game = new Game();
    new Controller(game);
},false);

