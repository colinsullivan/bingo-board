/**
 *  @file       ViewPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The functionality associated with viewing a bingo board.
 *  @class
 *  @extends    bingo.pages.BingoPage
 **/
bingo.pages.ViewPage = bingo.pages.BingoPage.extend({
    
    initialize: function() {
        bingo.pages.BingoPage.prototype.initialize.call(this);
        
        /* The kind of marker we will create for the bingo board */
        this.markerClass = bingo.widgets.BingoMarkerWidget;
        
        /* Every 5 seconds, refresh board */
        setInterval(function(me){
            return function() {
                me.markers.fetch();
            };
        }(this), 5000);
        this.markers.fetch();
    },
});
