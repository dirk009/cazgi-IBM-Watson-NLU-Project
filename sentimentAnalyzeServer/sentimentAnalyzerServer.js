const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    nlu = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {'emotion': {}}
    };
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        result = analysisResults.result.emotion.document.emotion;
        return res.send(result);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send({});
    });

    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    nlu = getNLUInstance();
    const analyzeParams = {
        'url': req.query.url,
        'features': {'sentiment': {}}
    };
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        result =  analysisResults.result.sentiment.document.label;
        console.log(JSON.stringify(result, null, 2));
        return res.send(result);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send("error");
    });
    //return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    nlu = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {'emotion': {}}
    };
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        result = analysisResults.result.emotion.document.emotion;
        return res.send(result);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send({});
    });
});

app.get("/text/sentiment", (req,res) => {
    nlu = getNLUInstance();
    const analyzeParams = {
        'text': req.query.text,
        'features': {'sentiment': {}}
    };
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        result =  analysisResults.result.sentiment.document.label;
        console.log(JSON.stringify(result, null, 2));
        return res.send(result);
    })
    .catch(err => {
        console.log('error:', err);
        return res.send("error");
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

