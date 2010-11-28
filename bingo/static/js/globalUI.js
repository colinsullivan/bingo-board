/**
 *  @file       globalUI.js
 *  Executes functions that need to be executed on both the editor and the viewer.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
 /*  Global to hold the board, used in retrieveMarkers closure to update the
     viewer every 1000ms. */
 var board = null;

/* modal object for displaying alerts */
var modal = null;

/* If we have a connection error currently */
var CONNECTION_ERROR = false;

/* Load jQuery */
//google.load('jquery', '1.4.2');
/* Next we are loading fonts, so when they load, start page up */
google.setOnLoadCallback(function() {
    $(document).ready(function(){
        WebFont.load({
            google: {
                families: ['Cantarell:regular,bold', 'PT Sans']
            },
            loading: function() {

            },
            active: initializePage,
            inactive: initializePage
        });

    });
});
/* Load fonts */
google.load('webfont', '1.0.12');


/**
 *  Initializes page, calls functions that are either implemented in editorUI.js
 *  or viewerUI.js.
 **/
function initializePage() {
    /* non-bingo controls */
    //initializeControls();
    
    /**
     *  Retrieve Bingo markers and create bingo board.
     *
    retrieveMarkers(function(){
        return function(data, textStatus) {
            createBoard(data, textStatus);
        };
    }, 
    function(){
        return function(request, textStatus, errorThrown) {
            connectionError();
        };
    });
    
    /* Create new modal alert box object */
    modal = new ConfirmModalAlert({});

}

/**
 *  Retrieves all markers, and updates the bingo board accordingly.  This is called
 *  from each BingoBoard frequently.
 **/
function retrieveAndUpdateBoard() {
    retrieveMarkers(function(){
        return function(data, textStatus){
            board.updateMarkers($.parseJSON(data));
            connectionErrorResolved();
        };
    }, function(){
        return function(request, textStatus, errorThrown) {
            connectionError();
        };
    });
}

/**
 *  If there is a connectionError, display this.
 **/
function connectionError() {
    /* If there was not already an error */
    if(!CONNECTION_ERROR) {
         modal.displayContent({
             title: 'Connection Error!', 
             content: 'A connection error has occurred!<br />Bingo is not being updated.',
             noOptions: true
        });
        CONNECTION_ERROR = true;
    }
    /* There was already an error, so modal dialog is open, and user
       is confused or angry
    else {
    }*/
}

/**
 *  If there is a healthy connection, run this.
 **/
function connectionErrorResolved() {
    /* If there was already an error */
    if(CONNECTION_ERROR) {
        /* Close modal display */
        modal.close();
        CONNECTION_ERROR = false;
    }
    /* There was no error, and we have a healthy connection
    else {
        
    }*/
}

