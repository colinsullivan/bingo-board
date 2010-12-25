/**
 *  @file       ViewPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The functionality associated with viewing a bingo board.
 *  @class
 *  @extends    bingo.pages.Page
 **/
bingo.pages.ViewPage = bingo.pages.Page.extend({
    
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
        
        setInterval(function(me){
            return function() {
                me.markers.fetch();
            };
        }(this), 1000);
    },
    render: function() {
        bingo.pages.Page.prototype.render.call(this);
        
        /* For each marker, create a bingo marker widget */
        this.markers.each(function(page, BingoMarkerWidget) {
            return function(marker) {
                var widget = new BingoMarkerWidget({
                    el: $('#bingo_marker-'+marker.get('number')), 
                    model: marker,
                    page: page, 
                });
            };
        }(this, bingo.widgets.BingoMarkerWidget));
        
        return this;
    }
});
