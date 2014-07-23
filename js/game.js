var game = {

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
    var ds = game.ds;
    for(var i=0; i < 4; i++) {
      for(var k=0; k < 3; k++) {
        ds['row_'+i+'_'+k] = screen.querySelector('.row_'+i+'_'+k);
      }
    }
    ds.flags = screen.querySelector('.flags');
    ds.fuel_pump = screen.querySelector('.fuel_pump');
    ds.game_over = screen.querySelector('.game_over');
    ds.life_0 = screen.querySelector('.life_0');
    ds.life_1 = screen.querySelector('.life_1');
    ds.life_2 = screen.querySelector('.life_2');
    ds.pit_stop = screen.querySelector('.pit_stop');
    ds.text = screen.querySelector('.text');

    game.render();
    game.timers.loop = setInterval(game.loop, 80);
  },
  checkCrash: function() {
    var matrix = game.matrix;
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

    if(cn <= game.chances[game.level][1]) {
      for(i = 0; i<3; i++) {
        if(i!==cp) {
          _row[i]=true;
        }
        else {
          _row[i]=false;
        }
      }
    }
    else if(cn <= game.chances[game.level][0]) {
      for(i = 0; i<3; i++) {
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
    for(i=0; i<3; i++) {
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
    if(score> game.levels[game.level]) {
      game.level+=1;
    }
  },
  rollCars: function() {
    var matrix = game.matrix;
    

    if(game.state !== 0 && game.checkCrash()) {
      game.lives--;
      if(game.lives>0) {
        audio.play('crash');
        game.state = 2;
        game.change++;
        setTimeout(function() {
          game.change++;
          game.resetMatrix();
          game.render();
          game.state = 1;
        },2000);
      }
      else {
        audio.play('die');
        game.state = 4;
        game.inputBlocked = true;
        game.change++;
        adv.show();
        setTimeout(function() {
          game.inputBlocked = false;
          game.change++;
          game.state = 0;
        },4000);
      }
    }
    if(game.state === 1) {
      game.score += game.getPoints(game.matrix[2]);
      if(game.score >=9999) {
        audio.play('win');
        game.score = 9999;
        game.state = 5;
        game.inputBlocked = true;
        setTimeout(function() {
          game.inputBlocked = false;
        }, 5000);
        game.change++;
      }
      else if(game.score >= game.pitstops[game.pitstops_made]) {
        audio.play('move');
        game.pitstops_made++;
        game.state = 3;
        game.inputBlocked = true;
        setTimeout(function() {
          game.inputBlocked = false;
        }, 3000);
        game.change++;
        game.matrix[3] = [false, false, false];
      }
      else {
        audio.play('roll');
        game.checkLevel(game.score);
      }
    }
    if(game.state !== 2 && game.state !== 3) {
      game.matrix[2] = game.matrix[1];
      game.matrix[1] = game.matrix[0];
      game.matrix[0] = game.newRow();
    }
  },
  loop: function() {
    if(game.counters.round >= game.rounds[game.level]) {
      game.counters.round = 0;
      if(game.state === 1 ||
          game.state === 0 ) {
       game.rollCars(); 
      }
      game.render();
    }
    else {
      game.renderSelf();
      if(game.change > 0) {
        game.renderOther();
        game.change--;
      }
      game.counters.round++;
    }
  },
  resetMatrix: function() {
    var matrix = game.matrix;
    for(var i=0; i < 4; i++) {
      for(var k=0; k < 3; k++) {
        matrix[i][k] = false;
      }
    }
    matrix[3][1] = true;
  },
  reset: function() {
    game.resetMatrix();
    game.score = 0;
    game.lives = 3;
    game.level = 0;
    game.state = 0;
    game.change = 1;
    game.pitstops_made = 0;
    game.inputBlocked = false;
  },
  start: function() {
    game.reset();
    game.state = 1;
  },
  resume: function() {
    game.matrix[3][1] = true;
    game.resetMatrix();
    game.change++;
    game.state = 1;
    game.render();
  },
  left: function() {
    if(game.inputBlocked) {
      return;
    }
    switch(game.state) {
      case 0: 
        audio.play('move');
        game.start();
        break;
      case 2:
      case 4:
        break;
      case 3:
        audio.play('move');
        game.resume();
        break;
      case 5:
        game.reset();
        game.start();
        break;
      default:
        audio.play('move');
        if(game.matrix[3][1]) {
          game.matrix[3][1] = false;
          game.matrix[3][0] = true;
        }
        else if(game.matrix[3][2]) {
          game.matrix[3][2] = false;
          game.matrix[3][1] = true;
        }
    }
  },
  right: function() {
    if(game.inputBlocked) {
      return;
    }
    switch(game.state) {
      case 0: 
        audio.play('move');
        game.start();
        break;
      case 2:
      case 4:
        break;
      case 3:
        audio.play('move');
        game.resume();
        break;
      case 5:
        game.reset();
        game.start();
        break;
      default:
        audio.play('move');
        if(game.matrix[3][0]) {
          game.matrix[3][0] = false;
          game.matrix[3][1] = true;
        }
        else if(game.matrix[3][1]) {
          game.matrix[3][1] = false;
          game.matrix[3][2] = true;
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
    game.ds.text.innerHTML=''+game.score;
  },
  renderMatrix: function() {
    var matrix = game.matrix,
      ds = game.ds;
    for(var i=0; i < 4; i++) {
      for(var k=0; k < 3; k++) {
        if(matrix[i][k]) {
          game.show(ds['row_'+i+'_'+k]);
        }
        else {
          game.hide(ds['row_'+i+'_'+k]);
        }
      }
    }
  },
  renderSelf: function() {
    var matrix = game.matrix,
      ds = game.ds;
    for(var k=0; k < 3; k++) {
      if(matrix[3][k]) {
        game.show(ds['row_3_'+k]);
      }
      else {
        game.hide(ds['row_3_'+k]);
      }
    }
  },
  renderLives: function() {
    var lives = game.lives;

    if(lives > 0) {
      game.show(game.ds.life_0);
    }
    else {
      game.hide(game.ds.life_0);
    }
    if(lives > 1) {
      game.show(game.ds.life_1);
    }
    else {
      game.hide(game.ds.life_1);
    }
    if(lives > 2) {
      game.show(game.ds.life_2);
    }
    else {
      game.hide(game.ds.life_2);
    }
  },
  renderOther: function() {
    if(game.state === 0 ||
        game.state === 4) {
      game.show(game.ds.game_over);
    }
    else {
      game.hide(game.ds.game_over);
    }
    if(game.state === 3 ) {
      game.show(game.ds.fuel_pump);
      game.show(game.ds.pit_stop);
    }
    else {
      game.hide(game.ds.fuel_pump);
      game.hide(game.ds.pit_stop);
    }
    if(game.state === 5 ) {
      game.show(game.ds.flags);
    }
    else {
      game.hide(game.ds.flags);
    }
  },
  render: function() {
    game.renderMatrix();
    game.renderLives();
    game.setScore();
    if(game.change > 0) {
      game.renderOther();
      game.change--;
    }
  }


};
