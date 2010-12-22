/**
 *  @file       HomePage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The HomePage is the page that the user sees after logging in.
 *  @class
 **/
bingo.pages.HomePage = function(params) {
    if(params) {
        this.init(params);
    }
};
bingo.pages.HomePage.prototype = new bingo.pages.Page();

/**
 *  @constructor
 **/
bingo.pages.HomePage.prototype.init = function(params) {
    bingo.pages.Page.prototype.init.call(this, params);
    
    /* We will have a set of bingo boards that we are the owner of */
    var boards = new bingo.models.BoardSet;
    
    this.boards = boards;
};