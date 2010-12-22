/**
 *  @file       EditPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  The functionality associated with the edit bingo board page.
 *  @class
 **/
bingo.pages.EditPage = function(params) {
    if(params) {
        this.init(params);
    }
};
bingo.pages.EditPage.prototype = new bingo.pages.Page();

bingo.pages.EditPage.prototype.init = function(params) {
    bingo.pages.Page.prototype.init.call(this, params);

    console.log('Edit page initialized.');
};