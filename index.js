/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

 // Instantiating the HTTP Server
var HTTPserver = http.createServer(function(req,res){
  unifiedServer(req,res);
});

// Start the HTTP server
HTTPserver.listen(config.HTTPport,function(){
  console.log('The server is up and running now on port '+config.HTTPport+" in "+config.envName+" mode");
});


// Instantiating the HTTPS Server

var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

var HTTPSserver = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
});

// Start the HTTPS server
HTTPSserver.listen(config.HTTPSport,function(){
  console.log('The server is up and running now on port '+config.HTTPSport+" in "+config.envName+" mode");
});



//Unified Server
var unifiedServer = function(req,res){

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
    res.setHeader('Content-Type','application/JSON');
    res.writeHead(statusCode);
    res.end(payloadString);

    // Log the request/response
    console.log('Return Response: ',statusCode,payloadString);

  });
  });

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
    res.setHeader('Content-Type','application/JSON');
    res.writeHead(statusCode);
    res.end(payloadString);

    // Log the request/response
    console.log('Return Response: ',statusCode,payloadString);

  });
  });

}


//Handlers
var handlers = {};

//*Sample Handler 
handlers.ping = function(data,callback){
  //Respond to ping to monitor uptime
  callback(200);
};

//*Not Found Handler
handlers.notFound = function(data,callback){
  callback(404);

};

//Request Router
var router = {
  'ping'  : handlers.ping
};

