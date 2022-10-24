var controllerModule = {
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

        controllerModule.screen.style.width = nw+"px";
        controllerModule.screen.style.height = nh+"px";
        controllerModule.screen.style.marginTop = ((rh-nh)/2)+"px";
        controllerModule.screen.style.fontSize = parseInt(nw*0.12,10) +"px";
    },
    left: function() {
        controllerModule.game.left();
        controllerModule.leftButton.classList.add('active');
    },
    right: function() {
        controllerModule.game.right();
        controllerModule.rightButton.classList.add('active');
    },
    relLeft: function() {
        controllerModule.leftButton.classList.remove('active');
    },
    relRight: function() {
        controllerModule.rightButton.classList.remove('active');
    },
    keyDown: function(e) {
        if(e.keyCode === 37) {
            controllerModule.left();
        }
        else if(e.keyCode === 39) {
            controllerModule.right();
        }
    },
    keyUp: function(e) {
        if(e.keyCode === 37) {
            controllerModule.relLeft();
        }
        else if(e.keyCode === 39) {
            controllerModule.relRight();
        }
    }
};

export const controller = controllerModule;
