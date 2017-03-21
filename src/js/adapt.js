(function(win,doc){
    var docEl = document.documentElement,
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        recalc = function() {
            if(docEl.clientWidth > 750){
                docEl.style.fontSize = (750 * 14 / 375) + 'px';
            }else if(docEl.clientWidth <= 320){
                docEl.style.fontSize = (320 * 14 / 375) + 'px';
            }else{
                docEl.style.fontSize = (docEl.clientWidth * 14 / 375) + 'px';
            }
        };
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(window,document);
