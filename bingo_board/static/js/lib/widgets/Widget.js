/**
 *  @file       Widget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This contains general stuff that needs to take place for any widget on the UI.
 *	@class
 **/
bingo.widgets.Widget = Backbone.View.extend({


    /**
     *  Create the DOM elements associated with this widget using a template.  The
     *  container member variable is then set automatically for the widget.  The widget
     *  is not inserted into the DOM.
     *
     *  @constructor
     *  @param  {jQueryTmplObject}  params.template The template to use to
     *  render this widget.
     *  @param  {Backbone.Model}    params.model    The model object to use.    
     *  @param  {bingo.pages.Page}    params.page    The page which contains this
     *  widget.
     **/    
    initialize: function() {
        var params = this.options;
        
        var template = params.template;
        if(typeof(template) == 'undefined' && typeof(params.el) == 'undefined') {
            throw new Error('params.template or params.el must be undefined');
        }
        else if(typeof(template) != 'undefined' && template.length == 0) {
            throw new Error('template not found');
        }
        this.template = template;
        
        var page = params.page;
        if(typeof(page) == 'undefined') {
            throw new Error('params.page is undefined');
        }
        this.page = page;

        

        _.bindAll(this, "render");
    },
    render: function() {
        var template = this.template;
        if(template) {
            this.el = template.tmpl(this.model.toJSON()).get(0);            
        }
        
        this.delegateEvents();
                
        return this;
    }
});