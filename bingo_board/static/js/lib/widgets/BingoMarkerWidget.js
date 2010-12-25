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
        
        
        
        _.bindAll(this, "render");
    },
    render: function() {
        bingo.widgets.Widget.prototype.render.call(this);
        
        return this;
    }
});
