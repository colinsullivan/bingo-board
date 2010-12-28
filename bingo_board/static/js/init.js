/**
 *  @file       init.js
 *  Initializes the application.  Called from the inline code at the bottom of 
 *  the page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  Initializes page by creating the proper page object.  This will be called from
 *  the callback within the initialize function.
 **/
bingo.init.initializePage = function(params) {

    /* Determine which page to create */
    var pageInitializer = {
        'index': bingo.pages.IndexPage, 
        'home': bingo.pages.HomePage,
        'view': bingo.pages.ViewPage,
        'edit': bingo.pages.EditPage
    };

    bingo.page = new pageInitializer[params.page](params);
    
}
 
/**
 *  This is the first function that is called, initializes everything.
 **/
bingo.init.initialize = function(params) {
    
    if(typeof(google) != 'undefined') {
        /* Next we are loading fonts, so when they load, start page up */
        google.setOnLoadCallback(function(params) {
            return function() {
                $(document).ready(function(params) {
                    return function(){
                        var completeCallback = function() {
                            bingo.init.initializePage(params);
                        }
                        WebFont.load({
                            google: {
                                families: ['Cantarell:regular,bold', 'PT Sans']
                            },
                            loading: function() {

                            },
                            active: completeCallback,
                            inactive: completeCallback
                        });

                    };
                }(params));
            };
        }(params));

        /* Load jQuery & fonts */
        //google.load('jquery', '1.4.4');
        google.load('webfont', '1.0.12');
    }
    else {
        $(document).ready(function(params) {
            return function () {
                /* There is a internet connection error, create the page anyway */
                bingo.init.initializePage(params);                
            };
        });
    }
}



