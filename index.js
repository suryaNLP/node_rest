/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

 // Configure the server to respond to all requests with a string
var server = http.createServer(function(req,res){

  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  //Get payload
  var decoder = new StringDecoder('utf-8');
  var buffer = '';

  req.on('data',function(data){
    buffer +=decoder.write(data);
  });

  req.on('end', function(){
    buffer += decoder.end();
  
  //Choose the handler request should be routed to
  var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

  //Data object to send to handle
  var data = {
    'trimmedPath' : trimmedPath,
    'queryStringObject' : queryStringObject,
    'method' : method,
    'headers' : headers,
    'payload' : buffer
  };

  //Route request as specified in router
  chosenHandler(data,function(statusCode,payload){

    //Set default status code 200
    statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

    //Log the request path
    payload = typeof(payload) == 'object' ? payload : {};

    //Convert payload to string
    var payloadString = JSON.stringify(payload);

    //Return the response
    res.writeHead(statusCode);
    res.end(payloadString);

    // Log the request/response
    console.log('Return Response: ',statusCode,payloadString);

  });
  });
});



// Start the server
server.listen(3000,function(){
  console.log('The server is up and running now');
});

//Handlers
var handlers = {};

//*Sample Handler 
handlers.sample = function(data,callback){
  //Callback HTTP status code, and a payload object
  callback(406,{'name':'sample handler'});
};

//*Not Found Handler
handlers.notFound = function(data,callback){
  callback(404);

};

//Request Router
var router = {
  'sample'  : handlers.sample
};