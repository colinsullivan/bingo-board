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
 
 number_ranges = {
     'B': {
         'min': 1, 
         'max': 16, 
     },
     'I': {
         'min': 16, 
         'max': 31, 
     },
     'N': {
         'min': 31, 
         'max': 46, 
     }, 
     'G': {
         'min': 46, 
         'max': 61, 
     }, 
     'O': {
         'min': 61, 
         'max': 76, 
     },
 }

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
        
                
        
        return this;
    }
});
