var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5231);

app.use(express.static('public'))

require('dotenv').config(); 
// ---
// var SpotifyWebApi = require('spotify-web-api-node');
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

console.log(clientId, clientSecret)

console.log()

var credentials = {
  clientId: clientId,
  clientSecret: clientSecret
};

const spotifyApi = new SpotifyWebApi(credentials);

module.exports = {spotifyApi};

spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
  
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
);
// ---

//Home View
app.get('/home',function(req,res,next){
    var context = {};
    res.render('home', context);
    }
);

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});