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
    $(document).ready(function(){
        var completeCallback = function() {
            bingo.init.initializePage(params);
        }
        WebFont.load({
            google: {
                families: ['Cantarell:regular,bold', 'PT Sans', 'PT Sans Caption']
            },
            loading: function() {

            },
            active: completeCallback,
            inactive: completeCallback
        });
    });
}
