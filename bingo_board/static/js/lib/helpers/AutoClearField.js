/**
 *  @file       AutoClearField.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A field that is cleared automatically when text is entered.  The current value
 *  of the field element is used as the default text.
 *  @class
 **/
bingo.helpers.AutoClearField = function(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  @param  {jQueryInputElement}    params.inputElement The input element which we
 *  will be watching for changes.
 *  @constructor
 **/
bingo.helpers.AutoClearField.prototype.init = function(params) {
    
    
    var inputElement = params.inputElement;
    if(typeof(inputElement) == 'undefined') {
        throw new Error('params.inputElement is undefined');
    }
    else if(inputElement.length == 0) {
        throw new Error('inputElement not found');
    }
    this.inputElement = inputElement;
    
    var defaultValue = inputElement.attr('value');
    if(typeof(defaultValue) == 'undefined' || defaultValue == '') {
        throw new Error('defaultValue is undefined or blank');
    }
    this.defaultValue = defaultValue;
    
    inputElement.focus(function(me){
        return function() {
            me.focus();
        };
    }(this));
    
    inputElement.blur(function(me){
        return function() {
            me.blur();
        };
    }(this));
};

/**
 *  This is called when the input element is focused.
 **/
bingo.helpers.AutoClearField.prototype.focus = function() {
    var inputElement = this.inputElement;
    var defaultValue = this.defaultValue;
    
    /* If our default text is still in the field */
    if(inputElement.attr('value') == defaultValue) {
        /* Clear text to allow user to type */
        inputElement.attr('value', '');
    }
};

/**
 *  This is called when the input element is blurred.
 **/
bingo.helpers.AutoClearField.prototype.blur = function() {
    var inputElement = this.inputElement;
    var defaultValue = this.defaultValue;
    
    /* If the user hasn't typed anything */
    if(inputElement.attr('value') == '') {
        /* Restore our default value */
        inputElement.attr('value', defaultValue);
    }
};
