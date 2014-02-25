var url = require('url');
//router.js - Provides a system for registering routes for REST APIs.

handlers = { 
  "get" : [], 
  "post" : [],
  "put" : [], 
  "delete" : [], 
  "head" : [], 
  "patch" : [], 
  "options" : [], 
  "trace" : [], 
  "connect" : [] 
}

errorHandler = null;

function cleanURL(url) {
    var splitURL = url.split('/');
    splitURL.shift();
    while (splitURL[splitURL.length-1] === "") {
      splitURL.pop();
    }
    return splitURL.join('/');
}

function matchURL(url, pattern) {
  var params = {}
  var splitURL = cleanURL(url).split('/');
  var splitPattern = pattern.split('/');
  var patternLength = splitPattern.length;
  var urlLength = splitURL.length;
  if (urlLength < patternLength) {
    return null;
  }
  
  for (var i = 0; i < patternLength; i++) {
    //if it is a static match, then just carry on
    var urlPart = splitURL[i]
    var patternPart = splitPattern[i];
    if (i === (patternLength-1) && patternPart === '*') {
      return params;
    } else if (i === (patternLength-1) && urlPart && patternPart.charAt(0) === ':' && 
                 patternPart.charAt(patternPart.length - 1) === '*') {
      var paramName = patternPart.substr(1, patternPart.length-2).toLowerCase();
      params[paramName] = urlPart;
      return params;
    } else if (urlPart && patternPart.charAt(0) === ':') {
      var paramName = patternPart.substr(1).toLowerCase();
      params[paramName] = urlPart;
    } else if (patternPart.charAt(patternPart.length - 1) === '*' &&
               patternPart.substr(0, patternPart.length - 1) === urlPart) {
      return params;
    } else if (urlPart !== patternPart) {
      return null;
    } else if (urlPart === patternPart) {
      //URL is fine.
    } else {
      console.log("WTH?!");
      return null;
    }
  }
  if (urlLength > patternLength) {
    return null;
  }

  return params;

}


module.exports = {
  route : function (request, response) {
    var parsedURL = url.parse(request.url, true, true);
    var handlerList = handlers[(request.method.toLowerCase())];
    if (handlerList === undefined) {
      errorHandler(request, response);
      return;
    }
    var params;
    var currentHandler;
    var matches = false;
    var i = 0;
    while (!matches && i < handlerList.length) {
      currentHandler = handlerList[i];
      params = matchURL(parsedURL.path, currentHandler.pattern);
      matches = (params !== null);
      i++;
    }
    if (matches) {
      request.params = params;
      currentHandler.handler(request, response);
    } else {
      //no matches
      errorHandler(request, response);
    }
  },
  "get" : function (path, callback) {
    handlers.get.push({pattern: cleanURL(path), handler: callback} );
  },
  "post" : function (path, callback) {
    handlers.post.push({pattern: cleanURL(path), handler: callback} );
  },
  "delete" : function (path, callback) {
    handlers.delete.push({pattern: cleanURL(path), handler: callback} );
  },
  "put" : function (path, callback) {
    handlers.put.push({pattern: cleanURL(path), handler: callback} );
  },
  "head" : function (path, callback) {
    handlers.head.push({pattern: cleanURL(path), handler: callback} );
  },
  "options" : function (path, callback) {
    handlers.options.push({pattern: cleanURL(path), handler: callback} );
  },
  "patch" : function (path, callback) {
    handlers.patch.push({pattern: cleanURL(path), handler: callback} );
  },
  "trace" : function (path, callback) {
    handlers.trace.push({pattern: cleanURL(path), handler: callback} );
  },
  "connect" : function (path, callback) {
    handlers.connect.push({pattern: cleanURL(path), handler: callback} );
  },
  "onError" : function (callback) {
    errorHandler = callback;
  }


}



