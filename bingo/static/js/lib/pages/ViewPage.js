/**
 *  @file       ViewPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The functionality associated with viewing a bingo board.
 *  @class
 **/
bingo.pages.ViewPage = function(params) {
    if(params) {
        this.init(params);
    }
};
bingo.pages.ViewPage.prototype = new bingo.pages.Page();

bingo.pages.ViewPage.prototype.init = function(params) {
    bingo.pages.Page.prototype.init.call(this, params);

    console.log('View Page initialized.');
};