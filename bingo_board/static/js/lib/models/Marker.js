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
        var updated_at = this.get('updated_at');
        /*  If there is an updated_at attribute */
        if(updated_at) {
            var new_updated_at = new Date(updated_at);
            /* Convert to date-time */
            this.set({
                'updated_at': new_updated_at
            });
        }
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
    /**
     *  Override save, so we don't end up sending the updated_at time to the server.
     *  for now this will be handled on the backend.
     **/
    save: function(attributes, options){
        /* Update updated_at attribute */
        this.set({
            'updated_at': new Date()
        });
        
        return Backbone.Model.prototype.save.call(this, attributes, options);
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
        var base = '/api/1/marker/?sort_by=-updated_at&board=';
        return base + this.board.id
    }, 
    fetch: function(){
        this.last_fetched_at = new Date();
        
        return Backbone.Collection.prototype.fetch.call(this);
    }, 
});