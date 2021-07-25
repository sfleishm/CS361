// Load from .env
require('dotenv').config(); 

var SpotifyWebApi = require('spotify-web-api-node');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

var credentials = {
  clientId: clientId,
  clientSecret: clientSecret
};

var spotifyApi = new SpotifyWebApi(credentials);


// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    // Do search using the access token
    // https://github.com/thelinmichael/spotify-web-api-node/blob/be15f1c742b35134ce5bd35521d8bf1ab1ba67cf/src/spotify-web-api.js#L270
    spotifyApi.searchArtists('Daft Punk').then(
      function(data) {
        console.log(data.body);
        var first_stats = data.body.artists.items[0];
        var artist_id = first_stats.id;
        // Get Elvis' albums
        console.log('Artist albums', data.body);
        spotifyApi.getArtistAlbums(artist_id).then(
          function(data) {
            console.log('Artist albums', data.body);
            // return data.body;
          },
          function(err) {
            console.error(err);
            // return false;
          }
        );
        var getArtistAlbums = function(artist_id) {
          spotifyApi.getArtistAlbums(artist_id).then(
            function(data) {
              // console.log('Artist albums', data.body);
              return data.body;
            },
            function(err) {
              // console.error(err);
              return false;
            }
          );
        }

        var getAlbumLength = function() {
          var items = getArtistAlbums.items.length;
          return items;
        }

        for (let i = 0; i < getAlbumLength; i++) {
          console.log(getArtistAlbums);
        }
        
        // console.log(data.body.artists.items[0]);
      },
      function(err) {
        console.log('Something went wrong!', err);
      }
    );
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

// // Get Elvis' albums
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//   function(data) {
//     console.log('Artist albums', data.body);
//   },
//   function(err) {
//     console.error(err);
//   }
// );