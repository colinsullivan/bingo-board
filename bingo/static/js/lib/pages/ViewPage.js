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
        this.markers = markers;

        _.bindAll(this, 'render');
        /* Bind collection events to render */
        markers.bind('refresh', this.render);
        markers.bind('add', this.render);
        markers.bind('remove', this.render);
        
        markers.refresh(this.userdata.markers);
        
    },
    render: function() {
        bingo.pages.Page.prototype.render.call(this);
        
        console.log('rendering markers:');
        console.log('this.markers.toJSON():');
        console.log(this.markers.toJSON());
        
        return this;
    }
});
