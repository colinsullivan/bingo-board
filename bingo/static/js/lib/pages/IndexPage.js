/**
 *  @file       IndexPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The page that the user uses to register and login.  Doesn't deal with any 
 *  backbone data, and thus doesn't really need to be a backbone view but 
 *  whatever.
 *  @class
 *  @extends    bingo.pages.Page
 **/
bingo.pages.IndexPage = bingo.pages.Page.extend({
    
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
