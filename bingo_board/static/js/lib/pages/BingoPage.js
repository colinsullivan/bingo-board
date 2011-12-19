/**
 *  @file       BingoPage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The functionality associated with viewing a bingo board.
 *  @class
 *  @extends    bingo.pages.Page
 **/
bingo.pages.BingoPage = bingo.pages.Page.extend({
    
    initialize: function() {
        bingo.pages.Page.prototype.initialize.call(this);

        var params = this.options;
        
        var userdata = params.userdata;
        
        var board = new bingo.models.Board(userdata.board);
        this.board = board;
        
        var markers = new bingo.models.MarkerSet;
        markers.board = board;
        this.markers = markers;
        
        var helpButton = $('#control-help');
        if(typeof(helpButton) == 'undefined') {
            throw new Error('helpButton is undefined');
        }
        else if(helpButton.length == 0) {
            throw new Error('helpButton not found');
        }
        this.helpButton = helpButton;
        
        /* When help button is pressed, show popup */
        helpButton.click(function(me) {
            return function() {
                me.show_help();
            };
        }(this));
        

        /* Bind collection events to render */
        markers.bind('refresh', this.render);
    },
    render: function() {
        bingo.pages.Page.prototype.render.call(this);
        
        var most_recent_call = new Date('Sat Jan 01 2000 00:00:00 GMT-0500');
        
        var markers = this.markers;
        
        /* For each marker, create a marker widget */
        markers.each(function(page, markerClass, most_recent_call) {
            return function(marker) {
                /* This function must be implemented in subclasses. */
                var widget = new markerClass({
                    el: $('#bingo_marker-'+marker.get('number')), 
                    model: marker,
                    page: page
                }).render();
                
            };
        }(this, this.markerClass, most_recent_call));
        
        /* We only need to create these once */
        markers.unbind('refresh', this.render);


        /**
         *  Increase the font size until the text is largest possible.
         *
         *  TODO: This is sooo terrible.
         **/
        var originalPageWidth = $(document).width();
        var decreasing = false;
        var increaseFontSize = function() {
            var pageWidth = $(document).width();

            if(!decreasing && pageWidth > originalPageWidth) {
                decreasing = true;
            }
            else if(decreasing && pageWidth <= originalPageWidth) {
                return;
            }

            var bingoMarker = $('#bingo_marker-66');
            var currentFontSize = 1*$('body').css('font-size').replace('px', '');
            if(decreasing) {
                currentFontSize--;
            }
            else {
                currentFontSize++;
            }
            $('body').css('font-size', currentFontSize+'px');

            if(bingoMarker.height() <= bingoMarker.parent().height()*0.8) {
                setTimeout(increaseFontSize, 50);
            }
            
        };
        increaseFontSize();

        
        return this;
    }
});
