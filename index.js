"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios")

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post(async function (req, res) {
  var intent = req.body.queryResult && 
  req.body.queryResult.intent && 
  req.body.queryResult.intent.displayName 
  ? req.body.queryResult.intent.displayName 
  :  "No intent." 
  var speech = "A problem occured. Intent: " + intent

  if (intent === 'number of repos for user')
  {
    var speech = req.body.queryResult &&
      req.body.queryResult.parameters &&
      req.body.queryResult.parameters.userName
      ? req.body.queryResult.parameters.userName
      : "Seems like some problem. Speak again.";

    // speech = req.body.queryResult &&
    // req.body.queryResult.parameters &&
    // req.body.userName
    // ? req.body.userName
    // : "Seems like some problem. Speak again.";

    var myerror = false;
    var username = req.body.userName

    const getRepos = async () => {
      try {
        return await axios.get(`https://api.github.com/users/${username}/repos`);
      } catch (error) {
        myerror = true;
        speech = 'Cannot get number of repos for ' + username + '.';
        console.error("ERROR OCCURED: " + error);
      }
    }

    const repos = await getRepos()

    if (!myerror)
    {
      speech = 'User ' + username + ' has ' + Object.keys(repos.data).length + ' number of repositories.';
    }
  }

  //if (intent === 'number of repos for user')


  var speechResponse = {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: speech
            }
          }
        ]
      }
    }
  };

  return res.json({
    payload: speechResponse,
    //data: speechResponse,
    fulfillmentText: speech,
    speech: speech,
    displayText: testing + testing2,
    source: "webhook-echo-sample"
  });
});


restService.listen(process.env.PORT || 8000, function () {
  console.log("Server up and listening!");
});
