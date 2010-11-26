/**
 *  @file       ClickableBingoMarker.js
 *  A bingo marker that is clickable.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Constructor
 *
 *  @param  Object  params      See BingoMarker.prototype.init
 **/
function ClickableBingoMarker(params) {
    if(params) {
        this.init(params);
    }
}
/* ClickableBingoMarker is a BingoMarker */
ClickableBingoMarker.prototype = new BingoMarker();

/**
 *  Same as parent constructor, with additional functionality.  We now bind the 
 *  click event of the cell to the clicked function.
 *
 *  @param  Object  params      See BingoMarker.prototype.init
 **/
ClickableBingoMarker.prototype.init = function(params) {
    BingoMarker.prototype.init.call(this, params);
    
    /* Bind to click event of cell */
    this.cell.bind('click', function(me){
        return function(e){
            me.clicked();
        };
    }(this));
}

/**
 *  Behavior when this bingo marker has been clicked.  We will enable the marker, then 
 *  inform the backend that this marker has been clicked.
 **/
ClickableBingoMarker.prototype.clicked = function() {
    /* If we are currently disabled, we will enable */
    if(this.enabled) {
        this.disable();
        var newValue = false;
    }
    else {
        this.enable();
        var newValue = true;
    }
    
    /* Send ajax to update DB */
    $.ajax({
        url: '/backend.php/update',
        data: {
            'number': this.number,
            'value': newValue
        }
    });
}