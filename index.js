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

restService.post("/repos", async function (req, res) {
  var speech = req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.userName
    ? req.body.queryResult.parameters.userName
    : "Seems like some problem. Speak again.";

  var testing = 'nothing';
  var error = false;

  const getRepos = async () => {
    try {
      return await axios.get(`https://api.github.com/users/${req.body.queryResult.parameters.userName}/repos`);
    } catch (error) {
      error = true;
      testing = "error";
      speech = "wrong"
      //speech = 'Cannot get number of repos for ' + req.body.queryResult.parameters.userName + '.';
      console.error(error);
    }
  }

  const repos = await getRepos()
  if (error)
  {
    speech = "wrong";
  }
  else
  {
    speech = "correct";
  }

  /*if (!error) {
    speech = 'User ' + req.body.queryResult.parameters.userName + ' has ' + Object.keys(repos.data).length + ' number of repositories.';
  }*/

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
    displayText: testing,
    source: "webhook-echo-sample"
  });
});


restService.listen(process.env.PORT || 8000, function () {
  console.log("Server up and listening");
});
