/**
 *  @file       BingoMarkerWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A marker on the bingo board.
 *  @class
 *  @extends    bingo.widgets.Widget
 **/
bingo.widgets.BingoMarkerWidget = bingo.widgets.Widget.extend({
    
    initialize: function() {
        bingo.widgets.Widget.prototype.initialize.call(this);

        var params = this.options;
        
        var el = $(this.el);
        

        var lastEnabledBorderElement = el.children('.last_enabled_border');
        if(typeof(lastEnabledBorderElement) == 'undefined') {
            throw new Error('lastEnabledBorderElement is undefined');
        }
        else if(lastEnabledBorderElement.length == 0) {
            throw new Error('lastEnabledBorderElement not found');
        }
        this.lastEnabledBorderElement = lastEnabledBorderElement;

        
        var markerElement = el.children('.bingo_marker');
        if(typeof(markerElement) == 'undefined') {
            throw new Error('params.markerElement is undefined');
        }
        else if(markerElement.length == 0) {
            throw new Error('markerElement not found');
        }
        this.markerElement = markerElement;
        
        
        _.bindAll(this, "render");
        var marker = this.model;
        marker.bind('change', this.render);      
    },
    render: function() {
        bingo.widgets.Widget.prototype.render.call(this);
        
        if(this.model.get('value')) {
            this.enable();
        }
        else {
            this.disable();
        }
        
        /* If this marker was the last called */
        if(this.model.get('last_called')) {
            /* UI */
            this.set_last_called();
        }
        else {
            this.unset_last_called();
        }
        
        
        return this;
    },
    enable: function() {
        this.markerElement.removeClass('disabled').addClass('enabled');
        
    }, 
    disable: function() {
        this.markerElement.removeClass('enabled').addClass('disabled');
    }, 
    set_last_called: function() {
        
        var markerElement = this.markerElement;

        /* Add lastEnabled class to our number */
        markerElement.addClass('lastEnabled');

        /* Put animating "caution" div behind last called number 
        var offset = el.offset();
        var top = offset.top-13;
        var left = offset.left-13;
        var width = el.outerWidth()+28;
        var height = el.outerHeight()+28;
        $(last_enabled).css({
            'width': width,
            'height': height,
            'top': top,
            'left': left
        });

        el.parent().prepend(last_enabled);
        last_enabled.show();*/
    }, 
    unset_last_called: function() {
        var markerElement = this.markerElement;

        markerElement.removeClass('lastEnabled');
    }, 
});
