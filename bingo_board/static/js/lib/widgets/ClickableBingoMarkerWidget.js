/**
 *  @file       ClickableBingoMarkerWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A marker widget for the edit page, that you can click on to call the number.
 *  @class
 *  @extends    bingo.widgets.BingoMarkerWidget
 **/
bingo.widgets.ClickableBingoMarkerWidget = bingo.widgets.BingoMarkerWidget.extend({
    
    initialize: function() {
        bingo.widgets.BingoMarkerWidget.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },
    render: function() {
        bingo.widgets.BingoMarkerWidget.prototype.render.call(this);
        
        return this;
    }
});
