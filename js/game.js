import { Audio } from './audio.js'
import { CHANCES, DEFAULT_MATRIX, LEVELS, PITSTOPS, ROUNDS, audioFilename, audioMarkers } from './config.js';

const gameState = {
    preGame: 0,
    playing: 1,
    lostLife: 2,
    pitStop: 3,
    gameOver: 4,
    gameWon: 5,
};

export class Game {
    audio = null;
    loopTimer = -1;
    score = 0;
    lives = 3;
    level = 0;
    change = 0;
    matrix = null;
    state = gameState.preGame;
    ds = {};
    counters = {
        round : 0,
        crash: 0
    };
    inputBlocked = false;
    pitstopsMade = 0;

    constructor() {
        this.audio = new Audio(audioFilename, audioMarkers);

        screen = document.querySelector('.lcd-panel');

        this.ds = {
            flags: screen.querySelector('.flags'),
            fuelPump: screen.querySelector('.fuel_pump'),
            gameOver: screen.querySelector('.game_over'),
            life0: screen.querySelector('.life_0'),
            life1: screen.querySelector('.life_1'),
            life2: screen.querySelector('.life_2'),
            pitStop: screen.querySelector('.pit_stop'),
            text: screen.querySelector('.text'),
        };

        for (let i=0; i < 4; i++) {
            for (let k=0; k < 3; k++) {
                this.ds['row_'+i+'_'+k] = screen.querySelector('.row_'+i+'_'+k);
            }
        }

        this.resetMatrix();
        this.render();
        this.loopTimer = setInterval(() => this.loop(), 80);
    }

    checkCrash() {
        for (let i = 0; i<3; i++) {
            if (this.matrix[3][i] && this.matrix[2][i]) {
                return true;
            } else if (this.matrix[3][i]) {
                return false;
            }
        }
        return false;
    }

    newRow() {
        // CHANGES[level][0] => chance to have two cars in new row
        // CHANGES[level][1] => chance to have only one car in new row
        //
        // cn = {1, 10}, if it is under CHANGES[level][0], or CHANCES[level][1], we have cars in new row
        // cp = {0, 2}, filled positions when 2 cars, empty when 1 car

        const cn = Math.floor(Math.random()*10) + 1;
        const cp = Math.floor(Math.random()*3);
        const row = [false, false, false];

        if (cn <= CHANCES[this.level][0]) {
            for (let i = 0; i<3; i++) {
                if (i!==cp) {
                    row[i]=true;
                } else {
                    row[i]=false;
                }
            }
        } else if (cn <= CHANCES[this.level][1]) {
            for (let i = 0; i<3; i++) {
                if (i===cp) {
                    row[i]=true;
                } else {
                    row[i]=false;
                }
            }
        }
        return row;
    }

    getPoints(row) {
        let cn = 0;
        let score = 5;
        for (let i=0; i<3; i++) {
            if (row[i]) {
                cn++;
            }
        }

        switch (cn) {
            case 1:
                score = 20;
                break;
            case 2:
                score = 40;
        }
        return score;
    }

    checkLevel(score) {
        if (score> LEVELS[this.level]) {
            this.level+=1;
        }
    }

    rollCars() {
        if (this.state !== gameState.preGame && this.checkCrash()) {
            this.lives--;
            if (this.lives>0) {
                this.audio.play('crash');
                this.state = gameState.lostLife;
                this.change++;
                setTimeout(() => {
                    this.change++;
                    this.resetMatrix();
                    this.render();
                    this.state = gameState.playing;
                },2000);
            } else {
                this.audio.play('die');
                this.state = gameState.gameOver;
                this.inputBlocked = true;
                this.change++;
                setTimeout(() => {
                    this.inputBlocked = false;
                    this.change++;
                    this.state = gameState.preGame;
                },4000);
            }
        }

        if (this.state === gameState.playing) {
            this.score += this.getPoints(this.matrix[2]);
            if (this.score >= LEVELS[9]) {
                this.audio.play('win');
                this.score = LEVELS[9];
                this.state = gameState.gameWon;
                this.inputBlocked = true;
                setTimeout(() => {
                    this.inputBlocked = false;
                }, 5000);
                this.change++;
            } else if (this.score >= PITSTOPS[this.pitstopsMade]) {
                this.audio.play('move');
                this.pitstopsMade++;
                this.state = gameState.pitStop;
                this.inputBlocked = true;
                setTimeout(() => {
                    this.inputBlocked = false;
                }, 3000);
                this.change++;
                this.matrix[3] = [false, false, false];
            } else {
                this.audio.play('roll');
                this.checkLevel(this.score);
            }
        }

        if (this.state !== gameState.lostLife && this.state !== gameState.pitStop) {
            this.matrix[2] = this.matrix[1];
            this.matrix[1] = this.matrix[0];
            this.matrix[0] = this.newRow();
        }
    }

    loop() {
        if (this.counters.round >= ROUNDS[this.level]) {
            this.counters.round = 0;
            if (this.state === gameState.playing || this.state === gameState.preGame) {
                this.rollCars();
            }
            this.render();
        } else {
            this.renderSelf();
            if (this.change > 0) {
                this.renderOther();
                this.change--;
            }
            this.counters.round++;
        }
    }

    resetMatrix() {
        this.matrix = JSON.parse(JSON.stringify(DEFAULT_MATRIX))
    }

    reset() {
        this.resetMatrix();
        this.score = 0;
        this.lives = 3;
        this.level = 0;
        this.state = gameState.preGame;
        this.change = 1;
        this.pitstopsMade = 0;
        this.inputBlocked = false;
    }

    start() {
        this.reset();
        this.state = gameState.playing;
    }

    resume() {
        this.matrix[3][1] = true;
        this.resetMatrix();
        this.change++;
        this.state = gameState.playing;
        this.render();
    }

    left() {
        if (this.inputBlocked) {
            return;
        }
        switch (this.state) {
            case gameState.preGame:
                this.audio.play('move');
                this.start();
                break;
            case gameState.lostLife:
            case gameState.gameOver:
                break;
            case gameState.pitStop:
                this.audio.play('move');
                this.resume();
                break;
            case gameState.gameWon:
                this.reset();
                this.start();
                break;
            default:
                this.audio.play('move');
                if (this.matrix[3][1]) {
                    this.matrix[3][1] = false;
                    this.matrix[3][0] = true;
                } else if (this.matrix[3][2]) {
                    this.matrix[3][2] = false;
                    this.matrix[3][1] = true;
                }
        }
    }

    right() {
        if (this.inputBlocked) {
            return;
        }
        switch (this.state) {
            case gameState.preGame:
                this.audio.play('move');
                this.start();
                break;
            case gameState.lostLife:
            case gameState.gameOver:
                break;
            case gameState.pitStop:
                this.audio.play('move');
                this.resume();
                break;
            case gameState.gameWon:
                this.reset();
                this.start();
                break;
            default:
                this.audio.play('move');
                if (this.matrix[3][0]) {
                    this.matrix[3][0] = false;
                    this.matrix[3][1] = true;
                } else if (this.matrix[3][1]) {
                    this.matrix[3][1] = false;
                    this.matrix[3][2] = true;
                }
        }

    }

    show(dse) { dse.classList.add('on'); }

    hide(dse) { dse.classList.remove('on'); }

    toggle(dse) { dse.classList.toggle('on'); }

    setScore() { this.ds.text.innerHTML=''+this.score; }

    renderMatrix() {
        for (let i=0; i < 4; i++) {
            for (let k=0; k < 3; k++) {
                if (this.matrix[i][k]) {
                    this.show(this.ds['row_'+i+'_'+k]);
                } else {
                    this.hide(this.ds['row_'+i+'_'+k]);
                }
            }
        }
    }

    renderSelf() {
        for (let k=0; k < 3; k++) {
            if (this.matrix[3][k]) {
                this.show(this.ds['row_3_'+k]);
            } else {
                this.hide(this.ds['row_3_'+k]);
            }
        }
    }

    renderLives() {
        if (this.lives > 0) {
            this.show(this.ds.life0);
        } else {
            this.hide(this.ds.life0);
        }
        if (this.lives > 1) {
            this.show(this.ds.life1);
        } else {
            this.hide(this.ds.life1);
        }
        if (this.lives > 2) {
            this.show(this.ds.life2);
        } else {
            this.hide(this.ds.life2);
        }
    }

    renderOther() {
        if (this.state === gameState.preGame || this.state === gameState.gameOver) {
            this.show(this.ds.gameOver);
        } else {
            this.hide(this.ds.gameOver);
        }
        if (this.state === gameState.pitStop) {
            this.show(this.ds.fuelPump);
            this.show(this.ds.pitStop);
        } else {
            this.hide(this.ds.fuelPump);
            this.hide(this.ds.pitStop);
        }
        if (this.state === gameState.gameWon) {
            this.show(this.ds.flags);
        } else {
            this.hide(this.ds.flags);
        }
    }

    render() {
        this.renderMatrix();
        this.renderLives();
        this.setScore();

        if (this.change > 0) {
            this.renderOther();
            this.change--;
        }
    }
};
