/**
 *  @file       globalUI.js
 *  Global variables.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

if(!bingo) {
    var bingo =  {
         page: null,
         /* This will store the models */
         models: {},
         /* This will store the widgets */
         widgets: {}, 
         /* This will store the page objects */
         pages: {},
         /* This will store some helpers */
         helpers: {}, 
         /* some init functions */
         init: {}, 
     
     };
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

