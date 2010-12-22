/**
 *  @file       IndexPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The page that the user uses to register and login.
 *  @class
 **/
bingo.pages.IndexPage = function(params) {
    if(params) {
        this.init(params);
    }
};
bingo.pages.IndexPage.prototype = new bingo.pages.Page();

/**
 *  @constructor
 **/
bingo.pages.IndexPage.prototype.init = function(params) {
    bingo.pages.Page.prototype.init.call(this, params);

    console.log('Index page initialized');
    
};