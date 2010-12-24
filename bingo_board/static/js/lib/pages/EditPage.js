/**
 *  @file       EditPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  The functionality associated with the edit bingo board page.
 *  @class
 *  @extends    bingo.pages.Page
 **/
bingo.pages.EditPage = bingo.pages.Page.extend({
    
    initialize: function() {
        bingo.pages.Page.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },
    render: function() {
        bingo.pages.Page.prototype.render.call(this);
        
        return this;
    }
});