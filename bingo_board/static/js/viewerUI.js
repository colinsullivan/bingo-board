/**
 *  @file       viewerUI.js
 *  Initial JS file for the viewer app.  Just creates the board.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  Create the bingo board.  Should be used in the success call of a jQuery.ajax function
 *  when bingo markers are retrieved.
 *
 *  @param  Object  data        The data retrieved from backend.
 *  @param  String  textStatus  The status of the HTTP request in text.
 **/
function createBoard(data, textStatus) {
    var markerStates = data;
    
    /* Create Bingo Board */
    board = new BingoBoard({
        'markerStates': markerStates
    });
    
    /* Every 1s, update board */
    setInterval(retrieveAndUpdateBoard, 1000);
    
    
}

function initializeControls() {
    /* When help button is clicked, show modal window with help content */
    $('#control-help').live('click', function() {
        modal.loadAndDisplayContent({'url': '/partials/viewerHelpPopup.html', 'title': 'Welcome to Bingo!'});
    });
}