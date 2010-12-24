/**
 *  @file       Backbone.sync.js
 *  Contains the Backbone.sync override.  This must be overridden so we can
 *  grab the "objects" attribute from tastypie response, and ignore the meta data.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
};

var getUrl = function(object) {
   if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
   return _.isFunction(object.url) ? object.url() : object.url;
 };

Backbone.sync = function(method, model, success, error) {
    var type = methodMap[method];
    var modelJSON = (method === 'create' || method === 'update') ?
        JSON.stringify(model.toJSON()) : null;


    if(success) {
        success = function(oldSuccess){
            return function(data, status) {
                if(data.meta && data.objects) {
                    oldSuccess(data.objects);
                }
            }
        }(success);
    }

    // Default JSON-request options.
    var params = {
        url:          getUrl(model),
        type:         type,
        contentType:  'application/json',
        data:         modelJSON,
        dataType:     'json',
        processData:  false,
        success:      success,
        error:        error
    };

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.processData = true;
        params.data        = modelJSON ? {model : modelJSON} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
        if (type === 'PUT' || type === 'DELETE') {
            if (Backbone.emulateJSON) params.data._method = type;
            params.type = 'POST';
            params.beforeSend = function(xhr) {
                xhr.setRequestHeader("X-HTTP-Method-Override", type);
            };
        }
    }

    // Make the request.
    $.ajax(params);
};