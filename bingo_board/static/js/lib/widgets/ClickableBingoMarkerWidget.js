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
        
        
        this.el.click(function(me){
            return function() {
                me.callNumber();
            }
        }(this));
        
        _.bindAll(this, "render");
    },
    render: function() {
        bingo.widgets.BingoMarkerWidget.prototype.render.call(this);
        
        return this;
    },
    callNumber: function() {
        this.model.set({
            value: true 
        });
        this.model.save(null, {
            success: function(me) {
                return function() {
                    me.enable();
                    me.setLastCalled();
                };
            }(this)
        });
    }, 
});
