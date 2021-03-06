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
        
        
        /* Clear board button */
        var clearButton = $('#control-clear');
        if(typeof(clearButton) == 'undefined') {
            throw new Error('clearButton is undefined');
        }
        else if(clearButton.length == 0) {
            throw new Error('clearButton not found');
        }
        this.clearButton = clearButton;
        
        clearButton.click(function(me) {
            return function() {
                me.clear_board();
            };
        }(this));


        var backButton = $('#control-back');
        if(typeof(backButton) == 'undefined') {
            throw new Error('backButton is undefined');
        }
        else if(backButton.length == 0) {
            throw new Error('backButton not found');
        }
        this.backButton = backButton;
        
        /* When back button is clicked, go to home page */
        backButton.click(function(){
            window.location = '/home';
        });

        /**
         *  Button to call random bingo marker
         **/
        var randomButton = $('#control-callrandom');
        if(typeof(randomButton) == 'undefined') {
            throw new Error('$\' is undefined');
        }
        else if(randomButton.length == 0) {
            throw new Error('randomButton not found');
        }
        this.randomButton = randomButton;

        /* When random button is clicked, call random marker */
        randomButton.click(function(board) {
            return function() {
                board.call_random();
            }
        }(this.board));
        
        
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
    /**
     *  This is when the user clicks on the clear board button.
     **/
    clear_board: function() {
        /* Display modal alert */
        this.notifier.confirm({
            'title': 'Are you sure?', 
            'content': 'All bingo markers will be cleared so that a new game can begin.',
            'confirmCallback': function(me) {
                return function() {
                    me.really_clear_board();
                }
            }(this),
            'confirmText': 'Clear Board'
        });
    },
    /**
     *  This is called after the user confirms that they want to clear the board.
     **/
    really_clear_board: function() {
        $.ajax({
            url: '/clear/'+this.board.get('id'), 
            success: function(me) {
                return function(data, status) {
                    if(status == 'success' && data == 'success') {
                        me.markers.fetch({silent: true});
                        
                    }
                };
            }(this)
        })
    }
});