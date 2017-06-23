var express = require('express');
var router = express.Router();

// azure sdk
var iothub = require('azure-iothub');
var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var connString = '';

var utils = require('../lib/utils');
var interval = 10000;

// auxiliary functions
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

router.get('/', function (req, res, next) {
  res.render('index', { title: 'ERIX DEVICE SIMULATOR' });
});

router.post('/', function (req, res, next) {
  connString = req.body.cs;
  res.render('config', { title: 'ERIX DEVICE SIMULATOR' });
});

router.get('/telemetry', function (req, res, next) {
  res.render('device', { title: 'ERIX DEVICE SIMULATOR' });
});

router.post('/telemetry', function (req, res, next) {
  switch (req.body.action) {
    case 'start':

      var client = clientFromConnectionString(connString);

      client.open(function (err) {
        if (err) {
          msg = 'Could not connect: ' + err;
        } else {
          // Create a message and send it to the IoT Hub at interval
          console.log('sending messages at : ' + interval + ' miliseconds interval');
          myTimer = setInterval(function () {
            var data = JSON.stringify(utils.composeMessage());
            var message = new Message(data);
            client.sendEvent(message, printResultFor('send'));
            console.log('tick: ' + Date.now())

          }, interval);
        }
      })
      res.render('device', { title: 'ERIX DEVICE SIMULATOR' });
      break;
    case 'stop':
      clearInterval(myTimer);
      res.render('device', { title: 'ERIX DEVICE SIMULATOR' });
      break;
    case 'fault':
      res.send('not implemented');
      break;      
  }

})

router.get('/config', function (req, res, next) {
  res.render('config', { title: 'ERIX DEVICE SIMULATOR' });
});

router.post('/config', function (req, res, next) {
  interval = req.body.imterval;

  res.render('device', { title: 'ERIX DEVICE SIMULATOR' });
});

module.exports = router;
