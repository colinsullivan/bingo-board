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
    /**
     *  Update last_fetched_at property so we know when we last looked.
     **/
    fetch: function(options){
        this.last_fetched_at = new Date();
        
        return Backbone.Collection.prototype.fetch.call(this, options);
    }, 
    /**
     *  Only update the models that have changed.  Since we know the 'value'
     *  attribute will have changed if the marker has changed, we can check against
     *  that.
     **/
    refresh: function(models, options) {
        
        /* If we have not yet created the models for the first time */
        if(!this.length) {
            /* Do it. */
            Backbone.Collection.prototype.refresh.call(this, models, options);
            
            /* get most recent marker */
            mostRecent = this.getMostRecent();
            
            /* Assign the most recent attribute */
            mostRecent.set({
                'last_called': true
            });
            
            /* End */
            return this;
            
        }
        
        models  || (models = []);
        options || (options = {});
        
        /* Get most recently called marker */
        currentMostRecent = this.getMostRecent();
        newMostRecent = currentMostRecent;
        
        /* For each marker retrieved from server */
        for(var i = 0, il = models.length; i < il; i++) {
            var attrs = models[i];
            
            /* Marker object */
            var marker = this.get(attrs.id);
            
            
            /* If marker has changed, update attributes */
            if(marker.get('value') != attrs.value) {
                marker.set(attrs);
            }
            
            
            /* If this marker was updated most recently (so far) */
            if(newMostRecent.get('updated_at') < marker.get('updated_at')) {
                newMostRecent = marker;
            }
            
        }
        
        /* If the most recent marker has changed */
        if(currentMostRecent != newMostRecent) {
            /* Update the attributes */
            currentMostRecent.set({
                'last_called': false
            });
            
            newMostRecent.set({
                'last_called': true, 
            });
        }

        if (!options.silent) this.trigger('refresh', this, options);
        return this;
    },
    getMostRecent: function() {
        /* Keep track of the most recently called marker, starting with the
            actually most recent */
        var mostRecentIndex = null;
        var possibleMostRecents = this.pluck('last_called');
        for(var i = 0, il = possibleMostRecents.length; i < il; i++) {
            if(possibleMostRecents[i]) {
                mostRecentIndex = i;
                /* there is only one most recent so we can stop looking */
                break;
            }
        }
        
        var mostRecent = null;
        if(mostRecentIndex == null) {
            mostRecent = this.at(0);
        }
        else {
            mostRecent = this.at(mostRecentIndex);
        }
        
        return mostRecent;
    }, 
    
});