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
    validate: function(attrs) {
        var name = attrs.name;
        if(!name || typeof(name) == 'undefined') {
            throw new Error('Name must be defined for a Bingo object.');
        }
        
        if(name == '') {
            throw new Error('Please enter a name for this Bingo object.');
        }
    },

    call_random: function() {
        var markers = this.markers;
        var uncalledMarkers = [];

        markers.each(function (uncalledMarkers) {
            return function (marker) {
                if(!marker.get('value')) {
                    uncalledMarkers.push(marker);
                }
            };
        }(uncalledMarkers));

        // If there are uncalled markers
        if(uncalledMarkers.length) {
            // Call a random one
            var index = Math.floor(Math.random()*uncalledMarkers.length);
            uncalledMarkers[index].set({
                'value': true,
                'last_called': true 
            }).save(); // TODO error handling and reorganization            
        }
    }
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
 