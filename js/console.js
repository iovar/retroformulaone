var controller = {
  timers: {
    resize: -1
  },
  game: null,
  isMobile: false,
  isTouchDevice: function () {
    try {
      return (window.ontouchstart === null);
    }
    catch(exc) {
      return false;
    }
  },
  setup: function(game) {
    var _this = this;
    this.isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || this.isTouchDevice() );
    this.eventDown = (this.isMobile ? "touchstart" : "mousedown");
    this.eventUp = (this.isMobile ? "touchend" : "mouseup");
    this.screen = document.querySelector('.lcd-panel');
    this.leftButton = document.querySelector('.left-button');
    this.rightButton = document.querySelector('.right-button');
    window.addEventListener("resize" ,
      function(e) {
        clearTimeout(_this.timers.resize);
        _this.timers.resize = setTimeout(_this.resizeScreen, 1000);
    },false);

    this.game = game;
    this.game.init(this.screen);
    this.leftButton.addEventListener(this.eventDown, this.left);
    this.rightButton.addEventListener(this.eventDown, this.right);
    this.leftButton.addEventListener(this.eventUp, this.relLeft);
    this.rightButton.addEventListener(this.eventUp, this.relRight);
    if(!this.isMobile) {
      window.addEventListener(
        'keydown', this.keyDown);
      window.addEventListener(
        'keyup', this.keyUp);
    }
    this.resizeScreen();
  },
  resizeScreen: function() {
    var w = window.innerWidth,
      h = window.innerHeight,
      rw = w - 40,
      rh = h - 133,
      nh,nw;
    if(rw/rh<1.5) {
      nh = rw/1.5;
      nw = rw;
    }
    else {
      nh = rh;
      nw = nh*1.5;
    }

    controller.screen.style.width = nw+"px";
    controller.screen.style.height = nh+"px";
    controller.screen.style.marginTop = ((rh-nh)/2)+"px";
    controller.screen.style.fontSize = parseInt(nw*0.12,10) +"px"; 
  },
  left: function() {
    controller.game.left();
    controller.leftButton.classList.add('active');
  },
  right: function() {
    controller.game.right();
    controller.rightButton.classList.add('active');
  },
  relLeft: function() {
    controller.leftButton.classList.remove('active');
  },
  relRight: function() {
    controller.rightButton.classList.remove('active');
  },
  keyDown: function(e) {
    if(e.keyCode === 37) {
      controller.left();
    }
    else if(e.keyCode === 39) {
      controller.right();
    }
  },
  keyUp: function(e) {
    if(e.keyCode === 37) {
      controller.relLeft();
    }
    else if(e.keyCode === 39) {
      controller.relRight();
    }
  }
};

