/**
 *  @file       Board.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A Bingo Board.
 *  @class
 *  @extends    Backbone.Model
 **/
bingo.models.Board = Backbone.Model.extend({
    
    /**
     *  @constructor
     **/
    initialize: function() {
    },
    url: function() {
        var url = '/api/1/board/';
        if(this.id) {
            url += this.id+'/';
        }
        return url;
    }, 
});


/**
 *  A set of bingo boards.
 *  @class
 *  @extends    Backbone.Collection
 **/
bingo.models.BoardSet = Backbone.Collection.extend({
    model: bingo.models.Board, 
    url: '/api/1/board/'
});
 