"use strict";
app.factory('MediaService', function($resource){
    return $resource('https://itunes.apple.com/:action',
        {action: "search", callback: 'JSON_CALLBACK'},
        {get:  {method: 'JSONP'}
    });
});
