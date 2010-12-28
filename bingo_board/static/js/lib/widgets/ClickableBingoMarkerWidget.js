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
                if(me.model.get('value')) {
                    me.unCallNumber();
                }
                else {
                    me.callNumber();                    
                }
            }
        }(this));
        
    },
    /**
     *  This is called when a user clicks on a marker that is not yet enabled.
     **/
    callNumber: function() {
        /* This number was called */
        /* Save to server */
        this.model.save({
            value: true 
        }, {
            success: function(me) {
                return function() {
                    me.page.markers.set_last_called();
                };
            }(this)
        });
    }, 
    /**
     *  This is called when the user clicks on a marker that is already enabled.
     **/
    unCallNumber: function() {
        this.model.save({
            value: false 
        }, {
            success: function(me){
                return function() {
                    me.page.markers.set_last_called();
                }
            }(this), 
        })
    }, 
});
