var submitButtons = document.querySelectorAll('input[type=submit]');
for(var index = 0; index < submitButtons.length; index++) {
    submitButtons[index].onclick = function() {
        this.disabled = true;
    };
}