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
        
        if(this.model.get('value')) {
            this.enable();
        }
        else {
            this.disable();
        }
        
        
        _.bindAll(this, "render");
    },
    render: function() {
        bingo.widgets.Widget.prototype.render.call(this);
        
        return this;
    },
    enable: function() {
        this.el.removeClass('disabled').addClass('enabled');
        
        if(this.model.get('last_called')) {
            this.setLastCalled();
        }
    }, 
    disable: function() {
        this.el.removeClass('enabled').addClass('disabled');
    }, 
    setLastCalled: function() {
        var el = $(this.el);
        
        /* Remove "caution" div from DOM */
        var last_enabled = $('#last_enabled').detach();

        /* Remove lastEnabled class from old number */
        $('.lastEnabled').removeClass('lastEnabled');

        /* Add lastEnabled class to our number */
        el.addClass('lastEnabled');

        /* Put animating "caution" div behind last called number */
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
        last_enabled.show();
    }, 
});
