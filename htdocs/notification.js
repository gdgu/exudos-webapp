const Notification = function Notification(message) {
    this.message = message

    document.body.innerHTML += '<div class="notificationwrapper"><div class="notification">' + message + '</div></div>'

    this.notificationWrapperDiv = document.querySelector('div.notificationwrapper')

    this.clear = function() {
        this.notificationWrapperDiv.outerHTML = ''
    }

    notificationOn = false
    notificationExists = true
    notificationWrapperDiv = document.querySelector('div.notificationwrapper')
    notificationDiv = document.querySelector('div.notification')
}

var notificationOn = false
var notificationWrapperDiv = document.querySelector('div.notificationwrapper')
var notificationDiv = document.querySelector('div.notification')

if(notificationDiv.innerHTML.trim() == '') {
    notificationWrapperDiv.classList.toggle('doesnotexist')
}

var notificationExists = true

if(notificationWrapperDiv == null || notificationWrapperDiv.classList.contains('doesnotexist')) {
    notificationExists = false
}

function notificationPopIn() {
    notificationWrapperDiv.classList.toggle('in')
    notificationWrapperDiv.classList.toggle('out')
    var audio = new Audio('/iOSTextNoteNotificationSound.mp3')
    audio.play()
    notificationOn = true
}

function notificationPopOut() {
    notificationWrapperDiv.classList.toggle('out')
    notificationWrapperDiv.classList.toggle('in')
    notificationOn = false
}

window.addEventListener('load', function() {
    if(notificationExists) {
        notificationPopIn()
        setTimeout(notificationPopOut, 7000)
    }
})