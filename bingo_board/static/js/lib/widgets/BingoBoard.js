/**
 *  @file       BingoBoard.js
 *  This is the class that is associated with a JavaScript bingo board.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Constructor
 *
 * @param Object    params      See BingoBoard.prototype.init    
 **/
function BingoBoard(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  Initialize BingoBoard object.
 *
 *  @param Object   params  {   
 *                              markerStates: the JSON object retrieved from backend
 *                          }
 **/
BingoBoard.prototype.init = function(params) {
    /* Create actual marker objects */
    var markers = [];
    for(i = 1; i < 76; i++) {
        markers[i] = this.createBingoMarker(i);
    }
    this.markers = markers;
}

/**
 *  Create a plain bingo marker, and return it.
 *
 *  @param  Number          number      The number for this marker
 *  @return BingoMarker                 The created bingo marker                                 
 **/
BingoBoard.prototype.createBingoMarker = function(number) {
    return new BingoMarker({
        'number': number
    });
}

/**
 *  Update all markers based on a marker states variable (retrieved from backend).
 *
 * @param Object  markerStates    The JSON object from backend containing all of the Bingo Marker states.
 **/
BingoBoard.prototype.updateMarkers = function(markerStates) {
    var markers = this.markers;
    
    /* If we retrieved no marker states, this means we should clear all our
    markers */
    console.log('markerStates.length:');
    console.log(markerStates.length);
    if(markerStates.length == 0) {
        
        for(i = 0, il = markers.length; i < il; i++) {
            if(markers[i]){
                markers[i].disable();
            }
        }
        
        return;
    }
    
    var lastEnabledIndex = null;
    for(i = 0, il = markerStates.length; i < il; i++) {
        var currMarkerStateObject = markerStates[i];
        var number = currMarkerStateObject[0];
        var value = currMarkerStateObject[1];
        var currMarkerState = markers[number].enabled;
        /* If marker should be disabled */
        if(value == false && currMarkerState == true)
        {
            /* disable it */
            markers[number].disable();
        }
        /* marker should be enabled */
        else if(value == true)
        {
            lastEnabledIndex = number;
            
            /* marker is not already enabled */
            if(currMarkerState == false)
            {
                markers[number].enable(false);
            }
        }       
    }
    
    /* If last enabled isn't still the lastEnabled */
    if(!$('#'+lastEnabledIndex).hasClass('lastEnabled')) {
        markers[lastEnabledIndex].setLastEnabled();        
    }
}