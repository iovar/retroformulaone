var adv = {
  elem : null,
  button : null,
  load: function() {
    if(!adv.elem) {
      adv.elem = document.querySelector('#adv');
      adv.button = adv.elem.querySelector('.close-button');
      adv.button.addEventListener('click', adv.hide);
    }
  },
  show : function() {
    adv.load();
    var offsetH = (window.innerHeight - 290)/2,
        offsetW = (window.innerWidth - 320)/2;
    adv.elem.style.top = offsetH +"px";
    adv.elem.style.left= offsetW +"px";
  },
  hide : function() {
    adv.load();
    adv.elem.style.top = "100%";
  }
};
