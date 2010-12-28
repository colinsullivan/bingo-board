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
    /* When setting the date, create a new date object */
    set: function(attrs, options) {
        if(attrs) {
            var old_updated_at = attrs['updated_at'];
            if(old_updated_at && typeof(old_updated_at) == 'string') {
                old_updated_at += 'Z';
                var new_updated_at = new Date();
                new_updated_at.setISO8601(old_updated_at);
                if(new_updated_at == 'Invalid Date') {
                    throw new Error('Date was invalid: '+old_updated_at);
                }
                attrs['updated_at'] = new_updated_at;
            }  
            
            /* If we've set the value to false */
            var new_value = attrs['value'];
            if(new_value == false) {
                /* Also set last_called to false */
                attrs['last_called'] = false;
            }
        }
        
        return Backbone.Model.prototype.set.call(this, attrs, options);        
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
        var new_updated_at = new Date();

        this.set({
            'updated_at': new_updated_at
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
    /**
     *  @constructor
     **/
    initialize: function() {
        
        /* Here we will store the last called marker */
        this.last_called_marker = null;
    }, 
    /**
     *  Keep markers sorted by update timestamp.
     **/
    comparator: function(marker) {
        return marker.get('updated_at');
    }, 
    url: function() {
        var base = '/api/1/marker/?board=';
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
        
        /* If we have no objects yet, we've not yet created the Markers */
        if(!this.length) {
            /* Create all markers from response */
            Backbone.Collection.prototype.refresh.call(this, models, options);
        }
        /* We've already created the markers, and instead of re-creating all
            the objects we will just merge the changes manually */
        else {
            /* For each marker object retrieved from server */
            for(var i = 0, il = models.length; i < il; i++) {
                var attrs = models[i];
                
                /* Current marker object */
                var marker = this.get(attrs.id);
                
                /* If marker has changed, its value will be different. */
                if(marker.get('value') != attrs.value) {
                    /* 'last_called' attr will be set later */
                    attrs['last_called'] = false;
                    
                    /* update marker object */
                    marker.set(attrs);
                    
                }
            }
            
            /* Sort the collection by which Marker has been updated last */
            this.sort();
        }
        
        
        /* Since the collection is sorted by the 'updated_at' property, the
            last called marker will be the last in the list */
        var last_marker = this.at(this.length - 1);
        /* IF the last marker in the list is enabled, it was the last called
            if it is the same as previous, no need to re-render because it is
            still the last called */
        if(last_marker.get('value')) {
            if(this.last_called_marker == null || this.last_called_marker != last_marker) {
                last_marker.set({
                    last_called: true 
                });
            }
        }
        else {
            /* Hide the last enabled marker.  
                TODO: These should be handled much more gracefully in 
                the future.  This logic should obviously not be in the model. */
            $('#last_enabled').hide();
            $('.lastEnabled').removeClass('lastEnabled');
        }
        
        this.last_called_marker = last_marker;
        
        return this;

    }        
});