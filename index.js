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

restService.post("/repos", function (req, res) {
  var speech = req.body.queryResult.parameters.userName;
  /*  req.body.queryResult &&
      req.body.queryResult.parameters &&
      req.body.queryResult.parameters.userName
      ? req.body.queryResult.parameters.userName
      : "Seems like some problem. Speak again.";
  if (speech === "Seems like some problem. Speak again.")
  {
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
  }*/

  var testing = "";
  var testing2 = "nothing";

  async function getRepos() 
  {
    try {
      testing = "IN GETREPOS"
      var repos = await axios.get('https://api.github.com/users/siriwans/repos');
      testing = req.body.queryResult.parameters.userName;
      speech = repos.data.json;
      if (repos.data.statusText === 'OK') {
        testing = req.body.queryResult.parameters.userName;
        //speech = 'User ' + req.body.queryResult.parameters.userName + ' has ' + repos.data.json.length + ' number of repositories.';
        speech = "YAYYYYYY";
      }
      else {
        // speech = 'Cannot get the number of repos for' + req.body.queryResult.parameters.userName;
        speech = "YAYYYYYY";
      }
    } catch (error) {
      console.error(error);
    }
  }

  const countRepos = async () => {
    const repos = await getRepos();
    /*if (repos.data.statusText === 'OK') {
      //speech = 'User ' + req.body.queryResult.parameters.userName + ' has ' + repos.data.json.length + ' number of repositories.';
      speech = "YAYYYYYY";
    }
    else {
      // speech = 'Cannot get the number of repos for' + req.body.queryResult.parameters.userName;
      speech = "YAYYYYYY";
    }*/
  }

  getRepos();


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
  console.log("Server up and listening");
});
