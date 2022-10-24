import { Audio } from './audio.js'

const markers = {
    roll: { start: 0, end: 0.3 },
    move: { start: 2, end: 2.3 },
    crash: { start: 4, end: 4.3 },
    die: { start: 6, end: 7.6 },
    win: { start: 9, end: 12.6 },
};
const filename = 'audio/sounds.mp3';


var gameModule = {
    audio: null,
    timers: {
        loop: -1
    },
    matrix: [
        [false, false, false],
        [false, false, false],
        [false, false, false],
        [false, true, false]
    ],
    score: 0,
    lives: 3,
    level: 0,
    change: 0,
    // 0 : pre-game
    // 1 : playing
    // 2 : lost life
    // 3 : pit stop
    // 4 : lost all lives
    // 5 : score 9999, game won (restarts)
    state: 0,
    ds : {},
    counters : {
        round : 0,
        crash: 0
    },
    inputBlocked: false,
    chances: [
        [4,2],
        [5,2],
        [5,3],
        [7,3],
        [7,4],
        [8,4],
        [8,5],
        [9,5],
        [9,6],
        [9,7]
    ],
    levels: [
        300,
        600,
        900,
        1200,
        1800,
        2600,
        3600,
        4500,
        6000,
        9999
    ],
    pitstops: [
        2000,
        5000,
        7800,
        10000
    ],
    pitstops_made: 0,
    rounds: [
        14,
        13,
        12,
        11,
        10,
        9,
        8,
        7,
        6,
        5
    ],
    init: function(screen) {
        var ds = gameModule.ds;
        this.audio = new Audio(filename, markers);

        for(var i=0; i < 4; i++) {
            for(var k=0; k < 3; k++) {
                ds['row_'+i+'_'+k] = screen.querySelector('.row_'+i+'_'+k);
            }
        }
        ds.flags = screen.querySelector('.flags');
        ds.fuel_pump = screen.querySelector('.fuel_pump');
        ds.gameModule_over = screen.querySelector('.game_over');
        ds.life_0 = screen.querySelector('.life_0');
        ds.life_1 = screen.querySelector('.life_1');
        ds.life_2 = screen.querySelector('.life_2');
        ds.pit_stop = screen.querySelector('.pit_stop');
        ds.text = screen.querySelector('.text');

        gameModule.render();
        gameModule.timers.loop = setInterval(gameModule.loop, 80);
    },
    checkCrash: function() {
        var matrix = gameModule.matrix;
        for(var i = 0; i<3; i++) {
            if(matrix[3][i] && matrix[2][i]) {
                return true;
            }
            else if(matrix[3][i]) {
                return false;
            }
        }
        return false;
    },
    newRow: function() {
        var cn = Math.floor(Math.random()*10) + 1,
            cp = Math.floor(Math.random()*3),
            _row = [false, false, false],
            i = 0;

        if(cn <= gameModule.chances[gameModule.level][1]) {
            for(let i = 0; i<3; i++) {
                if(i!==cp) {
                    _row[i]=true;
                }
                else {
                    _row[i]=false;
                }
            }
        }
        else if(cn <= gameModule.chances[gameModule.level][0]) {
            for(let i = 0; i<3; i++) {
                if(i===cp) {
                    _row[i]=true;
                }
                else {
                    _row[i]=false;
                }
            }
        }
        return _row;
    },
    getPoints: function(row) {
        var cn = 0,
            score = 10;
        for(let i=0; i<3; i++) {
            if(row[i]) {
                cn++;
            }
        }
        switch(cn) {
            case 1:
                score = 20;
                break;
            case 2:
                score = 40;
        }
        return score;
    },
    checkLevel: function(score) {
        if(score> gameModule.levels[gameModule.level]) {
            gameModule.level+=1;
        }
    },
    rollCars: function() {
        var matrix = gameModule.matrix;


        if(gameModule.state !== 0 && gameModule.checkCrash()) {
            gameModule.lives--;
            if(gameModule.lives>0) {
                this.audio.play('crash');
                gameModule.state = 2;
                gameModule.change++;
                setTimeout(function() {
                    gameModule.change++;
                    gameModule.resetMatrix();
                    gameModule.render();
                    gameModule.state = 1;
                },2000);
            }
            else {
                this.audio.play('die');
                gameModule.state = 4;
                gameModule.inputBlocked = true;
                gameModule.change++;
                setTimeout(function() {
                    gameModule.inputBlocked = false;
                    gameModule.change++;
                    gameModule.state = 0;
                },4000);
            }
        }
        if(gameModule.state === 1) {
            gameModule.score += gameModule.getPoints(gameModule.matrix[2]);
            if(gameModule.score >=9999) {
                this.audio.play('win');
                gameModule.score = 9999;
                gameModule.state = 5;
                gameModule.inputBlocked = true;
                setTimeout(function() {
                    gameModule.inputBlocked = false;
                }, 5000);
                gameModule.change++;
            }
            else if(gameModule.score >= gameModule.pitstops[gameModule.pitstops_made]) {
                this.audio.play('move');
                gameModule.pitstops_made++;
                gameModule.state = 3;
                gameModule.inputBlocked = true;
                setTimeout(function() {
                    gameModule.inputBlocked = false;
                }, 3000);
                gameModule.change++;
                gameModule.matrix[3] = [false, false, false];
            }
            else {
                this.audio.play('roll');
                gameModule.checkLevel(gameModule.score);
            }
        }
        if(gameModule.state !== 2 && gameModule.state !== 3) {
            gameModule.matrix[2] = gameModule.matrix[1];
            gameModule.matrix[1] = gameModule.matrix[0];
            gameModule.matrix[0] = gameModule.newRow();
        }
    },
    loop: function() {
        if(gameModule.counters.round >= gameModule.rounds[gameModule.level]) {
            gameModule.counters.round = 0;
            if(gameModule.state === 1 ||
                gameModule.state === 0 ) {
                gameModule.rollCars();
            }
            gameModule.render();
        }
        else {
            gameModule.renderSelf();
            if(gameModule.change > 0) {
                gameModule.renderOther();
                gameModule.change--;
            }
            gameModule.counters.round++;
        }
    },
    resetMatrix: function() {
        var matrix = gameModule.matrix;
        for(var i=0; i < 4; i++) {
            for(var k=0; k < 3; k++) {
                matrix[i][k] = false;
            }
        }
        matrix[3][1] = true;
    },
    reset: function() {
        gameModule.resetMatrix();
        gameModule.score = 0;
        gameModule.lives = 3;
        gameModule.level = 0;
        gameModule.state = 0;
        gameModule.change = 1;
        gameModule.pitstops_made = 0;
        gameModule.inputBlocked = false;
    },
    start: function() {
        gameModule.reset();
        gameModule.state = 1;
    },
    resume: function() {
        gameModule.matrix[3][1] = true;
        gameModule.resetMatrix();
        gameModule.change++;
        gameModule.state = 1;
        gameModule.render();
    },
    left: function() {
        if(gameModule.inputBlocked) {
            return;
        }
        switch(gameModule.state) {
            case 0:
                this.audio.play('move');
                gameModule.start();
                break;
            case 2:
            case 4:
                break;
            case 3:
                this.audio.play('move');
                gameModule.resume();
                break;
            case 5:
                gameModule.reset();
                gameModule.start();
                break;
            default:
                this.audio.play('move');
                if(gameModule.matrix[3][1]) {
                    gameModule.matrix[3][1] = false;
                    gameModule.matrix[3][0] = true;
                }
                else if(gameModule.matrix[3][2]) {
                    gameModule.matrix[3][2] = false;
                    gameModule.matrix[3][1] = true;
                }
        }
    },
    right: function() {
        if(gameModule.inputBlocked) {
            return;
        }
        switch(gameModule.state) {
            case 0:
                this.audio.play('move');
                gameModule.start();
                break;
            case 2:
            case 4:
                break;
            case 3:
                this.audio.play('move');
                gameModule.resume();
                break;
            case 5:
                gameModule.reset();
                gameModule.start();
                break;
            default:
                this.audio.play('move');
                if(gameModule.matrix[3][0]) {
                    gameModule.matrix[3][0] = false;
                    gameModule.matrix[3][1] = true;
                }
                else if(gameModule.matrix[3][1]) {
                    gameModule.matrix[3][1] = false;
                    gameModule.matrix[3][2] = true;
                }
        }

    },
    show: function(dse) {
        dse.classList.add('on');
    },
    hide: function(dse) {
        dse.classList.remove('on');
    },
    toggle: function(dse) {
        dse.classList.toggle('on');
    },
    setScore: function() {
        gameModule.ds.text.innerHTML=''+gameModule.score;
    },
    renderMatrix: function() {
        var matrix = gameModule.matrix,
            ds = gameModule.ds;
        for(var i=0; i < 4; i++) {
            for(var k=0; k < 3; k++) {
                if(matrix[i][k]) {
                    gameModule.show(ds['row_'+i+'_'+k]);
                }
                else {
                    gameModule.hide(ds['row_'+i+'_'+k]);
                }
            }
        }
    },
    renderSelf: function() {
        var matrix = gameModule.matrix,
            ds = gameModule.ds;
        for(var k=0; k < 3; k++) {
            if(matrix[3][k]) {
                gameModule.show(ds['row_3_'+k]);
            }
            else {
                gameModule.hide(ds['row_3_'+k]);
            }
        }
    },
    renderLives: function() {
        var lives = gameModule.lives;

        if(lives > 0) {
            gameModule.show(gameModule.ds.life_0);
        }
        else {
            gameModule.hide(gameModule.ds.life_0);
        }
        if(lives > 1) {
            gameModule.show(gameModule.ds.life_1);
        }
        else {
            gameModule.hide(gameModule.ds.life_1);
        }
        if(lives > 2) {
            gameModule.show(gameModule.ds.life_2);
        }
        else {
            gameModule.hide(gameModule.ds.life_2);
        }
    },
    renderOther: function() {
        if(gameModule.state === 0 ||
            gameModule.state === 4) {
            gameModule.show(gameModule.ds.gameModule_over);
        }
        else {
            gameModule.hide(gameModule.ds.gameModule_over);
        }
        if(gameModule.state === 3 ) {
            gameModule.show(gameModule.ds.fuel_pump);
            gameModule.show(gameModule.ds.pit_stop);
        }
        else {
            gameModule.hide(gameModule.ds.fuel_pump);
            gameModule.hide(gameModule.ds.pit_stop);
        }
        if(gameModule.state === 5 ) {
            gameModule.show(gameModule.ds.flags);
        }
        else {
            gameModule.hide(gameModule.ds.flags);
        }
    },
    render: function() {
        gameModule.renderMatrix();
        gameModule.renderLives();
        gameModule.setScore();
        if(gameModule.change > 0) {
            gameModule.renderOther();
            gameModule.change--;
        }
    }
};

export const game = gameModule;
