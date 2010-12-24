/**
 *  @file       Marker.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A Bingo marker
 *  @class
 *  @extends    Backbone.Model
 **/
bingo.models.Marker = Backbone.Model.extend({
    /**
     *  @constructor
     **/
    initialize: function(){
        
    }, 
    url: function() {
        var url = '/api/1/marker/';
        if(this.id) {
            url += this.id+'/';
        }
        return url;
    }, 
    validate: function(attrs){
        var number = attrs.number;
        var value = attrs.value;
        var board = attrs.board;
        
        if(typeof(number) != 'number' || number < 1 || number > 75) {
            throw new Error('A marker\'s number attribute must be a number between 1 and 75');
        }
        
        if(typeof(value) != 'boolean') {
            throw new Error('A marker\'s value attribute must be a boolean.');
        }
        
        console.log('typeof(board):');
        console.log(typeof(board));
        
    }, 
});

/**
 *  A bingo marker set
 *  @class
 *  @extends    Backbone.Collection
 **/
bingo.models.MarkerSet = Backbone.Collection.extend({
    model: bingo.models.Marker,
    url: '/api/1/marker', 
});