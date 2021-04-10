//Requirements
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

//Configuration
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
//Globals
var bmis = [];

//Events
app.get('/date', (req, res)=>{
  const pkmnNum = Math.floor(Math.random() * 800 + 1);
  const date = new Date();
  const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  let pkmnData = {};

  https.get("https://pokeapi.co/api/v2/pokemon/"+pkmnNum, (pkmnRes)=>{
    console.log("StatusCode: ", res.statusCode);
    console.log("headers: ", res.headers);
    let body = "";
    pkmnRes.on('data', (d)=>{
      body += d;
    });

    pkmnRes.on('end', ()=>{
      pkmnData = JSON.parse(body);
      let pkmnName = pkmnData.name.charAt(0).toUpperCase()+pkmnData.name.slice(1);
      res.render('date', {pkmn:pkmnName, pkmnSrc:pkmnData.sprites.front_default,
        date:date.toLocaleDateString('en-US', options), pageTitle:"Date & Pokemon"});
    });

  }).on('error', (e)=>{
     console.error(e);
   });
});

app.get('/', (req, res) => {
  console.log('/ loaded!');
  res.render('bmi', {bmis: bmis, pageTitle: "BMI Calculator"});
});

app.post('/', function(req, res) {
  let w = parseFloat(req.body.weight);
  let h = parseFloat(req.body.height);
  let bmi = w/h**2;
  console.log(h, w, bmi);
  bmis.push(bmi);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
