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
        if(this.get('id')) {
            url += this.get('id')+'/';
        }
        return url;
    }, 
    validate: function(attrs){
        var number = attrs.number;
        var value = attrs.value;
        
        if(number && typeof(number) != 'number') {
            throw new Error('A marker\'s number attribute must be a number');
        }
        else if(number && (number < 1 || number > 75)) {
            throw new Error('A marker\'s number attribute must be between 1 and 75');
        }
        
        if(value && typeof(value) != 'boolean') {
            throw new Error('A marker\'s value attribute must be a boolean.');
        }
        
    }, 
});

/**
 *  A bingo marker set
 *  @class
 *  @extends    Backbone.Collection
 **/
bingo.models.MarkerSet = Backbone.Collection.extend({
    model: bingo.models.Marker,
    url: function() {
        var base = '/api/1/marker/?board=';
        return base + this.board.id
    }, 
});