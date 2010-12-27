/**
 *  @file       viewerUI.js
 *  Initial JS file for the viewer app.  Just creates the board.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


function initializeControls() {
    /* When help button is clicked, show modal window with help content */
    $('#control-help').live('click', function() {
        modal.loadAndDisplayContent({'url': '/partials/viewerHelpPopup.html', 'title': 'Welcome to Bingo!'});
    });
}