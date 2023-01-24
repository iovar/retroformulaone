const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

export class Controller {
    game = null;
    constructor(game) {
        this.game = game;

        this.leftButton = document.querySelector('.left-button');
        this.rightButton = document.querySelector('.right-button');


        this.leftButton.addEventListener('touchstart', (e) => this.left(e), false);
        this.leftButton.addEventListener('mousedown', (e) => this.left(e), false);
        this.rightButton.addEventListener('touchstart', (e) => this.right(e), false);
        this.rightButton.addEventListener('mousedown', (e) => this.right(e), false);

        this.leftButton.addEventListener('touchend', (e) => this.relLeft(e));
        this.leftButton.addEventListener('mouseup', (e) => this.relLeft(e));
        this.rightButton.addEventListener('touchend', (e) => this.relRight(e));
        this.rightButton.addEventListener('mouseup', (e) => this.relRight(e));

        window.addEventListener('keydown', (e) => this.keyDown(e));
        window.addEventListener('keyup', (e) => this.keyUp(e));
    }

    left(e) {
        this.game.left();
        this.leftButton.classList.add('active');
        e.preventDefault();
    }

    right(e) {
        this.game.right();
        this.rightButton.classList.add('active');
        e.preventDefault();
    }

    relLeft(e) {
        this.leftButton.classList.remove('active');
        e.preventDefault();
    }

    relRight(e) {
        this.rightButton.classList.remove('active');
        e.preventDefault();
    }

    keyDown(e) {
        if (e.keyCode === LEFT_ARROW) {
            this.left();
        } else if (e.keyCode === RIGHT_ARROW) {
            this.right();
        }
    }

    keyUp(e) {
        if (e.keyCode === LEFT_ARROW) {
            this.relLeft();
        } else if (e.keyCode === RIGHT_ARROW) {
            this.relRight();
        }
    }
};
