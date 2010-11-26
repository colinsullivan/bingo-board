/**
 *  @file       BingoMarker.js
 *  An object which represents a cell on the bingo board.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Constructor
 *
 *    @param  Object  params        See BingoMarker.prototype.init
 **/
function BingoMarker(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  Initialize bingo marker object with provided parameters.
 *
 *    @param  Object  params        {
 *                                      number: The number for this marker
 *                                  }
 **/
BingoMarker.prototype.init = function(params) {
    /* What is our number */
    var number = params.number;
    if(typeof(number) == 'undefined') {
        throw new Error('params.number is undefined');
    }
    this.number = number;
    
    /* Bind to DOM object */
    var cell = $('#'+number);
    if(typeof(cell.get(0)) == 'undefined') {
        throw new Error('DOM is not formatted properly.  "#'+number+'" was not found.');
    }
    this.cell = cell;
    
    /* Bool to keep track of if we are enabled or not.  Initially disable. */
    this.enabled = false;
    
    /* Cell is initally de-activated */
    this.disable();
}

/**
 *  Either enables or disables.
 **/
BingoMarker.prototype.toggle = function() {
    if(this.enabled == true) {
        this.disable();
    }
    else if(this.enabled == false) {
        this.enable();
    }
}

/**
 *  Disables the marker by adding a class to the DOM element, and making sure to
 *  remove the "last enabled" graphic if necessary.
 **/
BingoMarker.prototype.disable = function() {
    var number_container = this.cell;
    
    number_container.addClass('disabled').removeClass('enabled');
    
    /* If we were the last enabled */
    if(number_container.hasClass('lastEnabled')) {
        $('#last_enabled').hide();
        number_container.removeClass('lastEnabled');
    }
    
    this.enabled = false;
}

/**
 *  Enables the marker by adding class.  Additionally, if setLastEnabled is true
 *  then we will set this marker as the last one to be called.
 *
 *    @param  Boolean  setLastEnabled       Wether or not this was the last marker to be 
 *                                              called.
 **/
BingoMarker.prototype.enable = function(setLastEnabled) {
    if(typeof(setLastEnabled) == 'undefined') {
        setLastEnabled = true;
    }
    var number_container = this.cell;
    
    number_container.addClass('enabled').removeClass('disabled');
    
    if(setLastEnabled == true) {
        this.setLastEnabled();
    }

    this.enabled = true;
}

/**
 *  Sets this bingo marker as the last enabled.  This should be called when this marker
 *  was the last to be called in the bingo game.
 **/
BingoMarker.prototype.setLastEnabled = function() {
    var number_container = this.cell;
    
    /* Remove "caution" div from DOM */
    var last_enabled = $('#last_enabled').detach();
    
    /* Remove lastEnabled class from old number */
    $('.lastEnabled').removeClass('lastEnabled');

    /* Add lastEnabled class to our number */
    number_container.addClass('lastEnabled');

    /* Put animating "caution" div behind last called number */
    var offset = number_container.offset();
    var top = offset.top-13;
    var left = offset.left-13;
    var width = number_container.outerWidth()+28;
    var height = number_container.outerHeight()+28;
    $(last_enabled).css({
        'width': width,
        'height': height,
        'top': top,
        'left': left
    });
    
    $('body').append(last_enabled);
    last_enabled.show();
}