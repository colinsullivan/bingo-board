/**
 *  @file       BingoBoardRow.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A row in the list of bingo boards on the home page.
 *  @class
 *  @extends    bingo.widgets.Widget
 **/
bingo.widgets.ManageBoardWidget = bingo.widgets.Widget.extend({
    
    initialize: function() {
        bingo.widgets.Widget.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },
    render: function() {
        bingo.widgets.Widget.prototype.render.call(this);
        
        return this;
    },
    events: {
        'click button.delete_board': 'delete_board'
    }, 
    /**
     *  Should be called when user clicks the delete button on the UI.
     **/
    delete_board: function() {
        this.page.notifier.confirm({
            title: 'Are you sure?', 
            content: 'Are you sure you want to delete this Board?<br />It will be permanently inaccessible.', 
            confirmCallback: function(me) {
                return function() {
                    me.really_delete_board();
                };
            }(this)
        });
    }, 
    /**
     *  This will actually delete the bingo board.  Should only be called after
     *  user has confirmed.
     **/
    really_delete_board: function() {
        this.model.destroy({
            success: function(me) {
                return function(model, response) {
                    /* Delete from page's collection */
                    me.page.boards.remove(model);
                    me.page.notify('Board was deleted successfully.');
                };
            }(this)
        })
    }
});
