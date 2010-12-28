/**
 *  @file       BingoPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The functionality associated with viewing a bingo board.
 *  @class
 *  @extends    bingo.pages.Page
 **/
bingo.pages.BingoPage = bingo.pages.Page.extend({
    
    initialize: function() {
        bingo.pages.Page.prototype.initialize.call(this);

        var params = this.options;
        
        var userdata = params.userdata;
        
        var board = new bingo.models.Board(userdata.board);
        this.board = board;
        
        var markers = new bingo.models.MarkerSet;
        markers.board = board;
        this.markers = markers;
        
        var helpButton = $('#control-help');
        if(typeof(helpButton) == 'undefined') {
            throw new Error('helpButton is undefined');
        }
        else if(helpButton.length == 0) {
            throw new Error('helpButton not found');
        }
        this.helpButton = helpButton;
        
        /* When help button is pressed, show popup */
        helpButton.click(function(me) {
            return function() {
                me.show_help();
            };
        }(this));
        
        
        
        

        /* Bind collection events to render */
        markers.bind('refresh', this.render);
    },
    render: function() {
        bingo.pages.Page.prototype.render.call(this);
        
        var most_recent_call = new Date('Sat Jan 01 2000 00:00:00 GMT-0500');
        
        /* For each marker, create a marker widget */
        this.markers.each(function(page, markerClass, most_recent_call) {
            return function(marker) {
                /* This function must be implemented in subclasses. */
                var widget = new markerClass({
                    el: $('#bingo_cell-'+marker.get('number')), 
                    model: marker,
                    page: page
                }).render();
                
            };
        }(this, this.markerClass, most_recent_call));
        
        return this;
    },
});
