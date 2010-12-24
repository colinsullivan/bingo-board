/**
 *  @file       editorUI.js
 *  The initial javascript file for the editor interface.  We retrieve all the markers
 *  and initialize the clickable bingo board.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  Create the clickable bingo board based on the data from backend.  This is used 
 *  in the callback function from the ajax call (jQuery.ajax).
 *
 *  @param  Object  data        The data retrieved from backend.
 *  @param  String  textStatus  The status of the HTTP request in text.
 **/
function createBoard(data, textStatus) {
    var markerStates = data;
    
    /* Create Bingo Board */
    board = new ClickableBingoBoard({
        'markerStates': markerStates
    });
    
    /* Update board every 10 seconds just in case */
    setInterval(retrieveAndUpdateBoard, 10000);
    
    
}

/**
 *  Initialize all of the controls on the page (not relating to bingo board)
 **/
function initializeControls() {
    /* When help button is clicked, show modal window with help content */
    $('#control-help').live('click', function() {
        modal.loadAndDisplayContent({'url': '/partials/editorHelpPopup.html', 'title': 'Welcome to Bingo!'});
    });
    
    /* When clear board button is clicked, show modal window with help content */
    $('#control-clear').live('click', clearBoardButtonClicked);
    
}

/**
 *  When clear button has been clicked, we open a modal dialog to ask "Are you sure?"
 **/
function clearBoardButtonClicked() {
    
    /* Display modal alert */
    modal.displayContentWithConfirm({
        'title': 'Are you sure?', 
        'content': 'All bingo markers will be cleared so that a new game can begin.',
        'confirmCallback': clearBoard,
        'confirmText': 'Clear Board'
    });
    
    /* If the user really wants to clear the board, confirm event will be triggered */
}

/**
 *  This function is executed when user decides to clear the board (confirms).
 *  After this is called the board should be cleared.
 **/
function clearBoard() {
    $.ajax({
        url: window.location+'/clearBoard',
        success: function() {
            retrieveAndUpdateBoard();
            modal.displayContent({'title': 'Success!', 'content': 'Board has been reset.  Good luck!'});
        },
        error: function() {
            modal.displayContent({'title': 'Error!', 'content': 'An error has occurred.'});
        }
    });
}