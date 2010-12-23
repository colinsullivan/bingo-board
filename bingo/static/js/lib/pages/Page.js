/**
 *  @file       Page.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A page object, which contains views and data for each page
 *  @class
 *  @extends    Backbone.View
 **/
bingo.pages.Page = Backbone.View.extend({
    
    initialize: function() {
        Backbone.View.prototype.initialize.call(this);

        var params = this.options;
        
        /* Create new modal alert box object for alerting the user */
        this.notifier = new ConfirmModalAlert({});

        /* A boolean in case we have lost connection to the server */
        this.CONNECTION_ERROR = false;
        
        /* The data to populate the boards with */
        var userdata = params.userdata;
        if(typeof(userdata) == 'undefined') {
            throw new Error('params.userdata is undefined');
        }
        this.userdata = userdata;
        
        /* Any text fields that are class autoclear should be autocleared */
        $('input.autoclear').each(function() {
            var field = new AutoClearField({
                inputElement: $(this), 
            });
        });
        
        
        _.bindAll(this, "render");
    },
    render: function() {
        Backbone.View.prototype.render.call(this);
        
        return this;
    }
});
