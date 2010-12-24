/**
 *  @file       ajax.js
 *  Global functions associated with ajax calls.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 

/**
 *  Retrieve all bingo markers from the database and use callback function.
 *
 * @param  callback        Function in the form required by jQuery.ajax
 * @param  errorCallback        Function  to call in the event of a connection error.
 **/
function retrieveMarkers(callback, errorCallback) {
    $.ajax({
        url: window.location+'/retrieve',
        type: 'json',
        success: callback(data, textStatus),
        error: errorCallback()
    });
}