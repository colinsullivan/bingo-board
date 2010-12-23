/**
 *  @file       HomePage.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The HomePage is the page that the user sees after logging in.
 *  @class
 *  @extends    bingo.pages.Page
 **/
bingo.pages.HomePage = bingo.pages.Page.extend({
    
    initialize: function() {
        bingo.pages.Page.prototype.initialize.call(this);

        var params = this.options;
        
        /* We will have a set of bingo boards that we are the owner of */
        var boards = new bingo.models.BoardSet;

        this.boards = boards;
        
        /* When add board button is clicked, we will be adding a bingo board */
        var addBoardButton = $('button#add_board');
        addBoardButton.bind('click', function(me){
            return function() {
                me.addBoard();
            }
        }(this));

        _.bindAll(this, 'render');
        /* Bind collection events to render */
        boards.bind('refresh', this.render);
        boards.bind('add', this.render);
        boards.bind('remove', this.render);
        
    },
    /* re-render list of boards */
    render: function() {
        bingo.pages.Page.prototype.render.call(this);
        
        console.log('Rendering:');
        console.log('this.boards:');
        console.log(this.boards);
        
        return this;
    },
    
    addBoard: function() {
        console.log('addBoard');
        /* Create a new board object */
        this.boards.create();
    }
});