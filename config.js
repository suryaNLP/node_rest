/*
 *
 * Export Configuration Variables
 */

// Container for environments
var environments = {};


// Staging Environment
environments.staging = {
	'port' : 3000,
	'envName' : 'staging'
};

// Production Environment
environments.production = {
	'port' : 5000,
	'envName' : 'production'
};

// Determining environment requested 
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase(): '';

// Checking if environment defined
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentToExport;