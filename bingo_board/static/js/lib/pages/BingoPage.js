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

        _.bindAll(this, 'render');
        /* Bind collection events to render */
        markers.bind('refresh', this.render);
        markers.bind('add', this.render);
        markers.bind('remove', this.render);        
    },
    render: function() {
        bingo.pages.Page.prototype.render.call(this);
        
        /* TODO: Ask someone if this is cross-browser compatible and kosher */
        var most_recent_call = new Date('0');
        
        /* For each marker, create a marker widget */
        this.markers.each(function(page, markerClass, most_recent_call) {
            return function(marker) {
                /* This function must be implemented in subclasses. */
                var widget = new markerClass({
                    el: $('#bingo_marker-'+marker.get('number')), 
                    model: marker,
                    page: page
                });
                
                var marker_updated_at = marker.get('updated_at');
                if(marker_updated_at > most_recent_call) {
                    most_recent_call = marker_updated_at;
                    widget.setLastCalled();
                }
            };
        }(this, this.markerClass, most_recent_call));
        
        return this;
    },
});
