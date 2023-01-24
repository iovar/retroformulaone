const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

export class Controller {
    game = null;
    constructor(game) {
        this.game = game;

        this.leftButton = document.querySelector('.left-button');
        this.rightButton = document.querySelector('.right-button');


        this.leftButton.addEventListener('touchstart', () => this.left());
        this.leftButton.addEventListener('mousedown', () => this.left());
        this.rightButton.addEventListener('touchstart', () => this.right());
        this.rightButton.addEventListener('mousedown', () => this.right());

        this.leftButton.addEventListener('touchend', () => this.relLeft());
        this.leftButton.addEventListener('mouseup', () => this.relLeft());
        this.rightButton.addEventListener('touchend', () => this.relRight());
        this.rightButton.addEventListener('mouseup', () => this.relRight());

        window.addEventListener('keydown', (e) => this.keyDown(e));
        window.addEventListener('keyup', (e) => this.keyUp(e));
    }

    left() {
        this.game.left();
        this.leftButton.classList.add('active');
    }

    right() {
        this.game.right();
        this.rightButton.classList.add('active');
    }

    relLeft() { this.leftButton.classList.remove('active'); }

    relRight() { this.rightButton.classList.remove('active'); }

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
