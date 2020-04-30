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
  var speech = req.body.queryResult.parameters.userName;
  req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.userName
    ? req.body.queryResult.parameters.userName
    : "Seems like some problem. Speak again.";

  var testing = "nothing"
  
  const getRepos = async () => {
    try {
      var repos = await axios.get('https://api.github.com/users/siriwans/repos');
      testing = repos.data
      if (repos.data.statusText === 'OK') {
        speech = 'User ' + req.body.queryResult.parameters.userName + ' has ' + repos.data.json.length + ' number of repositories.';
      }
      else {
        s;peech = 'Cannot get the number of repos for ' + req.body.queryResult.parameters.userName;
      }
    } catch (error) {
      console.error(error);
    }
  }

  await getRepos()

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
    displayText: speech,
    source: "webhook-echo-sample"
  });
});


restService.listen(process.env.PORT || 8000, function () {
  console.log("Server up and listening");
});
