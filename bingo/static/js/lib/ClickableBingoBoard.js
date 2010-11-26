/**
 *  @file       ClickableBingoBoard.js
 *  Functionality associated with a bingo board that allows you to click and add new stuff.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Constructor
 *  @param  Object  params    See BingoBoard.prototype.init
 **/
function ClickableBingoBoard(params) {
    if(params) {
        this.init(params);
    }
}
/*  ClickableBingoBoard is a BingoBoard.    */
ClickableBingoBoard.prototype = new BingoBoard();

/**
 *  This method needs to be overrided because we are no longer creating a simple 
 *  bingo marker, we are instead creating a clickable one.
 *
 *    @param  Number    number  The number for this marker.     
 **/
ClickableBingoBoard.prototype.createBingoMarker = function(number) {
    return new ClickableBingoMarker({
        'number': number
    });
}