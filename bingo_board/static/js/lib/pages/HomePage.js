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
        
        var $ = jQuery;
        
        /* We will have a set of bingo boards that we are the owner of */
        var boards = new bingo.models.BoardSet;
        this.boards = boards;
        
        /* This is a reference to the bingo board list */
        var boardTable = $('#board_table');
        if(typeof(boardTable) == 'undefined') {
            throw new Error('boardTable is undefined');
        }
        else if(boardTable.length == 0) {
            throw new Error('boardTable not found');
        }
        this.boardTable = boardTable;

        /* This is the table header so we can keep it in there */
        var boardTableHeader = $('#board_table_header');
        if(typeof(boardTableHeader) == 'undefined') {
            throw new Error('boardTableHeader is undefined');
        }
        else if(boardTableHeader.length == 0) {
            throw new Error('boardTableHeader not found');
        }
        this.boardTableHeader = boardTableHeader;
        
        /* This is a template for each of the rows in the board table */
        var boardRowTemplate = $('#board_row_template');
        if(typeof(boardRowTemplate) == 'undefined') {
            throw new Error('params.boardRowTemplate is undefined');
        }
        else if(boardRowTemplate.length == 0) {
            throw new Error('boardRowTemplate not found');
        }
        this.boardRowTemplate = boardRowTemplate;
        
        /* This is a template when the board table is empty */
        var emptyBoardRowTemplate = $('#empty_board_row_template');
        if(typeof(emptyBoardRowTemplate) == 'undefined') {
            throw new Error('emptyBoardRowTemplate is undefined');
        }
        else if(emptyBoardRowTemplate.length == 0) {
            throw new Error('emptyBoardRowTemplate not found');
        }
        this.emptyBoardRowTemplate = emptyBoardRowTemplate;

        
        /* Input element for board name */
        var addBoardNameInputElement = $('input#add_board_input');
        this.addBoardNameInputElement = addBoardNameInputElement;
        
        /* When add board button is clicked, we will be adding a bingo board */
        var addBoardButton = $('button#add_board_button');
        addBoardButton.bind('click', function(me){
            return function() {
                me.addBoard();
            }
        }(this));
        this.addBoardButton = addBoardButton;

        _.bindAll(this, 'render');
        /* Bind collection events to render */
        boards.bind('refresh', this.render);
        boards.bind('add', this.render);
        boards.bind('remove', this.render);
        
        boards.refresh(this.userdata.boards);
        
    },
    /* re-render list of boards */
    render: function() {
        bingo.pages.Page.prototype.render.call(this);
        
        var frag = document.createDocumentFragment();
        
        /* If there are collections */
        if(this.boards.length) {
            /* Copy table header, and put in fragment */
            frag.appendChild(this.boardTableHeader.get(0));
            /* Build collection table */
            this.boards.each(function(frag, template, ManageBoardWidget, page){
                return function(board){
                    var widget = new ManageBoardWidget({
                        template: template, 
                        model: board,
                        page: page
                    }).render();

                    frag.appendChild(widget.el);
                };
            }(frag, this.boardRowTemplate, bingo.widgets.ManageBoardWidget, this));
        }
        /* If not, display empty board list */
        else {
            var emptyBoardTableContents = this.emptyBoardRowTemplate.tmpl().get(0);
            frag.appendChild(emptyBoardTableContents);
        }
        
        this.boardTable.html(frag);
        
        return this;
    },
    
    addBoard: function() {
        
        this.add_board_loading_start();

        var name = this.addBoardNameInputElement.attr('value');
        /* Create a new board object */
        var board = new bingo.models.Board().save({
            name: name
        }, {
            success: function(me) {
                return function(model, response) {
                    me.boards.add(model);
                    me.notify('Board added successfully.');
                    me.add_board_loading_stop();
                }
            }(this)
            
        });
    },
    add_board_loading_start: function() {
        var button = this.addBoardButton;
        
        button.attr('disabled', 'true').html('Loading...');
    }, 
    add_board_loading_stop: function() {
        var button = this.addBoardButton;
        
        button.html('Create').removeAttr('disabled');
    }
});