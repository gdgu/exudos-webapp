var listOfMenuItems = [
    {
        id: 'assignments',
        title: 'Assignments',
        submenu: [
            'createassignment', 'submitassignment', 'listassignment'
        ],
        disabled: [],
        togglestate: false
    },
    {
        id: 'forums',
        title: 'Forum',
        submenu: [
            'newchat', 'messages', 'notices', 'uploadnotice'
        ],
        disabled: [
            'newchat', 'messages'
        ],
        togglestate: false
    },
    {
        id: 'evaluation',
        title: 'Evaluation',
        submenu: [
            'internalmarks', 'marksreport'
        ],
        disabled: [],
        togglestate: false
    },
    {
        id: 'courses',
        title: 'Courses',
        submenu: [
            'uploadcoursematerial', 'mycourses', 'mytimetable'
        ],
        disabled: [
            'mytimetable'
        ],
        togglestate: false
    },
    {
        id: 'feedback',
        title: 'Feedback',
        submenu: [
            'assignmentfeedback', 'facultyfeedback'
        ],
        disabled: [
            'assignmentfeedback', 'facultyfeedback'
        ],
        togglestate: false
    }
]

function hideAllSubmenus() {
    for(let index = 0; index < listOfMenuItems.length; index++) {
        var menuId = listOfMenuItems[index].id;
        let expandedSubmenus = document.querySelector('div.expanded#' + menuId);
        if(listOfMenuItems[index].togglestate) {
            expandedSubmenus.style.visibility = 'hidden';
            expandedSubmenus.style.opacity = 0;
            listOfMenuItems[index].togglestate = false;
        }
    }
}

for(let index = 0; index < listOfMenuItems.length; index++) {
    var menuId = listOfMenuItems[index].id;
    let expandedSubmenus = document.querySelector('div.expanded#' + menuId);
    // set their visibility to hidden, opacity to 0 by default
    expandedSubmenus.style.visibility = 'hidden';
    expandedSubmenus.style.opacity = 0;

    var navTabItem = document.querySelector('div.menubar ul.tabs li#' + menuId);
    navTabItem.addEventListener('click', function() {
        if(listOfMenuItems[index].togglestate) {
            hideAllSubmenus()
        }
        else {
            hideAllSubmenus()
            expandedSubmenus.style.visibility = '';
            expandedSubmenus.style.opacity = '';            

            listOfMenuItems[index].togglestate = !listOfMenuItems[index].togglestate;
        }
    });
}

// disabledfeatures class toggle
for(var anIndex = 0; anIndex < listOfMenuItems.length; anIndex++) {
    for(var anotherIndex = 0; anotherIndex < listOfMenuItems[anIndex].disabled.length; anotherIndex++) {
        var disabledId = listOfMenuItems[anIndex].disabled[anotherIndex]
        var element = document.querySelector('li#' + disabledId)
        if(element) {
            element.className = 'disabledfeature'
        }
    }
}
