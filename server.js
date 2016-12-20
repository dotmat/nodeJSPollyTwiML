"use strict";

var express = require('express');
var AWS = require('aws-sdk');
var awsConfig = require('aws-config');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

// Load the config files
var config = require('./config.js').get(process.env.NODE_ENV);
AWS.config = awsConfig({
region: config.awsConfig.region,
maxRetries: config.awsConfig.maxRetries,
accessKeyId: config.awsConfig.accessKeyId,
secretAccessKey: config.awsConfig.secretAccessKey,
timeout: config.awsConfig.timeout
});

// Create a new AWS Polly object
var polly = new AWS.Polly();

var express = require('express')
var app = express()

// Generate an Audiofile and serve stright back to the user for use as a file stright away
app.get('/play/:voiceId/:textToConvert', function (req, res) {
  var pollyCallback = function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response

    // Generate a unique name for this audio file, the file name is: PollyVoiceTimeStamp.mp3
    var filename = req.params.voiceId + (new Date).getTime() + ".mp3";
    fs.writeFile('./audioFiles/'+filename, data.AudioStream, function (err) {
      if (err) {
        console.log('An error occurred while writing the file.');
        console.log(err);
      }
      console.log('Finished writing the file to the filesystem ' + '/audioFiles/'+filename)

      // Send the audio file
      res.setHeader('content-type', 'audio/mpeg');
      res.download('audioFiles/'+filename);
    });
  };

  var pollyParameters = {
    OutputFormat: 'mp3',
    Text: unescape(req.params.textToConvert),
    VoiceId: req.params.voiceId
  };

  // Make a request to AWS Polly with the text and voice needed, when the request is completed push callback to pollyCallback
  polly.synthesizeSpeech(pollyParameters, pollyCallback);
})

// Serve a saved audio file from audioFiles
app.get('/audioFiles/:audioFileToServe', function (req, res) {

  // set response header
  res.setHeader('content-type', 'audio/mpeg');
  res.sendFile('/audioFiles/'+req.params.audioFileToServe, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
})

// Generate an audio file and save to the audioFiles directory
app.get('/:voiceId/:textToConvert', function (req, res) {
  var pollyCallback = function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response

    // Generate a unique name for this audio file, the file name is: PollyVoiceTimeStamp.mp3
    var filename = req.params.voiceId + (new Date).getTime() + ".mp3";
    fs.writeFile('./audioFiles/'+filename, data.AudioStream, function (err) {
    if (err) {
      console.log('An error occurred while writing the file.');
      console.log(err);
    }
      console.log('Finished writing the file to the filesystem')
      res.send(config.serverAddress + '/audioFiles/' + filename)
    });
  };

  var pollyParameters = {
   OutputFormat: 'mp3',
   Text: req.params.textToConvert,
   VoiceId: req.params.voiceId
  };

  // Make a request to AWS Polly with the text and voice needed, when the request is completed push callback to pollyCallback
  polly.synthesizeSpeech(pollyParameters, pollyCallback);
})

  app.listen(config.port, function () {
  console.log('Example app listening on port ' + config.port)
})
