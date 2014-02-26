RestRoute
==============

Simple HTTP request/response router for simple REST applications.

Setup
==============

Install RestRoute via npm:

    npm install restroute

and import it into your project a-like so:

    var router = require('restroute');

Usage
===============

RestRoute supports routes for all current HTTP/1.1 methods. To add a GET method handler looks like this:

    var pattern = ...
    router.get(pattern, handler);
    
    function handler (request, response) {
      //do things here
    });

Handlers for a given method are processed in the order they are added, so make sure to put the most specific handlers first, then add the general ones.

To execute the handler, simply pass your HTTP request and response objects through the `go(request, response)` method.

Handler Patterns
---------------

The `pattern` is a simple way to handle incoming urls from requests. It supports the following formatting features.

 * Strict text matching eg: set your pattern to `"/"` or `"/downloads"` or `"/images/cats"`
   * This is for exact matches, so `"/downloads"` would not match `"/downloads/sub-folder"`.
 * Parameterized matching: `"/:parameter"` or `"/testing/:parameterNameHere/data"`
   * These are made available as `request.params.parameterNameHere` for your callback function.
 * Wildcards for directory matching:
   * Loose: `pattern = "/downloads*"` means that `pattern` would match both `"/downloads"` and any subdirectory below it.
   * Strict: `pattern = "/downloads/*"` would only match the subdirectories, but not `"/downloads"`


Other Features
---------------
You can also provide a default error handler in the event that the request matches none of the current handlers.

    router.onError(errorHandler);
    function errorHandler(request, response) {
      //Error handling code here.
    }

Example
===============

This simple example demonstrates a simple use of RestRoute.

    //Imports
    var http = require('http');
    var router = require('restroute');

    //Handler functions
    function welcome (req, res) {
      res.writeHead(200);
      res.end("Hello world!");
    }
    function echo (req, res) {
      res.writeHead(200);
      res.end(req.params.echo);
    }
    function errors (req, res) {
      res.writeHead(404);
      res.end("404");
    }

    //Add handlers to the router
    router.onError(errors);
    router.get("/", welcome);
    router.get("/:echo", echo);

    //Use them in a server
    http.createServer(router.go).listen(8080);

Navigate to:

 * http://localhost:8080,, you should see "Hello World".
 * http://localhost:8080/something, you will recieve "something". 
 * But, http://localhost:8080/something/else results in "404" because of RestRoute's strict pattern matching. You could change this using the pattern `/:echo*` or `/:echo/*` depending on your needs.
