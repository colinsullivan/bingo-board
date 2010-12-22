/**
 *  @file       Page.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A Page object, which contains views and data for the page.
 *  @class
 **/
bingo.pages.Page = function(params) {
    if(params) {
        this.init(params);
    }
};


bingo.pages.Page.prototype.init = function(params) {

    /* Create new modal alert box object for alerting the user */
    this.notifier = new ConfirmModalAlert({});
    
    /* A boolean in case we have lost connection to the server */
    this.CONNECTION_ERROR = false;
    
    
    
};