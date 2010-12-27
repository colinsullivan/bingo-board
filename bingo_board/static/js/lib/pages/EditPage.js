/**
 *  @file       EditPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  The functionality associated with the edit bingo board page.  This is the same
 *  as the ViewPage with some extra functionality, so we are subclassing that.
 *  @class
 *  @extends    bingo.pages.BingoPage
 **/
bingo.pages.EditPage = bingo.pages.BingoPage.extend({
    /**
     *  @constructor
     **/
    initialize: function() {
        bingo.pages.BingoPage.prototype.initialize.call(this);
        
        /* The kind of marker we will create for the bingo board */
        this.markerClass = bingo.widgets.ClickableBingoMarkerWidget;
        
        /* Now, and then every 30 seconds, refresh board just to make sure */
        setInterval(function(me){
            return function() {
                me.markers.fetch({silent: true});
            };
        }(this), 30000);
        this.markers.fetch();
    },
    show_help: function() {
        this.notifier.alert({
            'url': '/static/partials/editorHelpPopupContent.html',
            'title': 'Welcome to Bingo!'
        });  
    },     
});