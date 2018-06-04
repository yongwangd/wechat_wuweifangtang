var hue = require("node-hue-api");
var HueApi = hue.HueApi;
    var lightState = hue.lightState;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var hostname = "192.168.1.215",
    username = "8slN4SI7m3i1419pS5vVOPvkgkBplBBS63a2le8T",
    api;
var state = lightState.create();

api = new HueApi(hostname, username);

var turnOff = () => {
    api.setLightState(1, state.off)
}

var displayResult = function(result) {
    console.log(result);
};

var displayError = function(err) {
    console.error(err);
};

// api.groups()
//     .then(displayResult)
//     .done();

function turnon() {
	api.setLightState(1, state.on())
	    .then(displayResult)
	    .fail(displayError)
	    .done();
	
	api.setLightState(3, state.on())
	    .then(displayResult)
	    .fail(displayError)
	    .done();

	return Promise.resolve('Ok');
}

function turnoff(){
	api.setLightState(1, state.off())
	    .then(displayResult)
	    .fail(displayError)
	    .done();
	
	api.setLightState(3, state.off())
	    .then(displayResult)
	    .fail(displayError)
	    .done();
	    return Promise.resolve('Ok')
}

module.exports = {turnon, turnoff};