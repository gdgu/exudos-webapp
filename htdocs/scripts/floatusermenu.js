// flag to control toggle of floatMenu section
var floatMenuFlag = false;

// floatMenu section whose visibility is to be toggled
var floatMenuItem = document.querySelector('div.floatmenu');

// floatMenu item set display to none
floatMenuItem.style.display = 'none';

// floatMenu arrow span which will show transformable arrow
var floatMenuArrowSpan = document.querySelector('span.userblock div.arrow');

// floatMenu switch anchor which will toggle status of floatMenu section
var floatMenuSwitch = document.querySelector('span.userblock a.user');

// control toggle of floatMenu section
floatMenuSwitch.onclick = function() {
    // if floatMenu section is toggled off
    if(floatMenuFlag == false) {
        // floatMenu arrow span transform 180 deg to show inverted arrow
        floatMenuArrowSpan.style.transform = 'rotateX(180deg)';
        // floatMenu item set display to on
        floatMenuItem.style.display = 'block';
        // floatMenu set text color as blue
        this.style.color = '#ccc';
        // set floatMenu toggle flag
        floatMenuFlag = true;
    }
    // if floatMenu section is toggled on
    else {
        // floatMenu arrow span transform 0 deg to show not inverted arrow
        floatMenuArrowSpan.style.transform = 'rotateX(0deg)';
        // floatMenu item set display to off
        floatMenuItem.style.display = 'none';
        // floatMenu set text color as default
        this.style.color = null;
        // set floatMenu toggle flag
        floatMenuFlag = false;
    }
};