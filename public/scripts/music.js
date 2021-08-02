// Load from .env
document.addEventListener('DOMContentLoaded', sayHi)
document.addEventListener('DOMContentLoaded', get_search_criteria)

require('dotenv').config(); 
const { spotifyApi } = require('././app.js')

// var SpotifyWebApi = require('spotify-web-api-node');
// const SpotifyWebApi = require('spotify-web-api-node');

// const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;

// var credentials = {
//   clientId: clientId,
//   clientSecret: clientSecret
// };

// var spotifyApi = new SpotifyWebApi(credentials);

// Do something with the search button is hit
async function sayHi() {
  document.getElementById('search-button').addEventListener('click', function(event)
    {
      clear_search_list();
      console.log("hi");
      get_search_criteria();
      console.log(get_search_criteria());
      add_search_item();
      // spotifyGetCreditals();
      spotifyArtist();
    }
  )
}

// Grab the radio value for the search result
function get_search_criteria()
{
  var searchValue;
  if (document.getElementById('artist-radio').checked)
  {
    console.log("artist");
    searchValue = "artist";
    return searchValue;
  }
  if (document.getElementById('song-radio').checked)
  {
    console.log("song");
    searchValue = "song";
    return searchValue;
  }
}

// Add new list group item
function add_search_item()
{
  var divList = document.getElementById('search-result-lists');
  for (let i = 0; i < 11; i ++)
  {
    var hyperNode = document.createElement("button");
    var linkText = document.createTextNode(i);

    hyperNode.appendChild(linkText);
    hyperNode.onclick = add_to_user_list;
    hyperNode.className = "list-group-item list-group-item-action";
    hyperNode.title = "my title test";
    hyperNode.href = "google.com";
  
    divList.appendChild(hyperNode);
  }
}

// Clear the song list
function clear_search_list()
{
  document.getElementById('search-result-lists').innerHTML = "";
}

// Function to send selected song (button) down to the user created list
function add_to_user_list()
{
  var userList = document.getElementById('added-song-list');

  var currentElement = window.event;
  var text = currentElement.target.innerHTML;

  var addedSong = document.createElement("button");
  addedSong.className = "list-group-item list-group-item-action";
  var songText = document.createTextNode(text);

  addedSong.appendChild(songText);
  userList.appendChild(addedSong);

}

function spotifyArtist()
{
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
}

// const spotify = async() => {
//   await spotifyApi.clientCredentialsGrant()
//   .then(data => {
//       console.log('The access token expires in ' + data.body['expires_in']);
//       console.log('The access token is ' + data.body['access_token']);
  
//       // Save the access token so that it's used in future calls
//       spotifyApi.setAccessToken(data.body['access_token']);
//   })
//   .then(() => {
//       // do stuff with the code here
//       // Get an artist or Song here
//       spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
//        .then(function(data) {
//             console.log('Artist information', data.body);
//         }, function(err) {
//             console.error(err);
//       });

//   })
//   .catch(err => {
//       console.log('Something went wrong when retrieving an access token', err);
//   });
// }

// Retrieve an access token.
// spotifyApi.clientCredentialsGrant().then(
//   function(data) {
//     console.log('The access token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);

//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//     // Do search using the access token
//     // https://github.com/thelinmichael/spotify-web-api-node/blob/be15f1c742b35134ce5bd35521d8bf1ab1ba67cf/src/spotify-web-api.js#L270
//     spotifyApi.searchArtists('Daft Punk').then(
//       function(data) {
//         console.log(data.body);
//         var first_stats = data.body.artists.items[0];
//         var artist_id = first_stats.id;
//         // Get Elvis' albums
//         console.log('Artist albums', data.body);
//         spotifyApi.getArtistAlbums(artist_id).then(
//           function(data) {
//             console.log('Artist albums', data.body);
//             // return data.body;
//           },
//           function(err) {
//             console.error(err);
//             // return false;
//           }
//         );
//         var getArtistAlbums = function(artist_id) {
//           spotifyApi.getArtistAlbums(artist_id).then(
//             function(data) {
//               // console.log('Artist albums', data.body);
//               return data.body;
//             },
//             function(err) {
//               // console.error(err);
//               return false;
//             }
//           );
//         }

//         var getAlbumLength = function() {
//           var items = getArtistAlbums.items.length;
//           return items;
//         }

//         for (let i = 0; i < getAlbumLength; i++) {
//           console.log(getArtistAlbums);
//         }
        
//         // console.log(data.body.artists.items[0]);
//       },
//       function(err) {
//         console.log('Something went wrong!', err);
//       }
//     );
//   },
//   function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
//   }
// );

// // // Get Elvis' albums
// // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
// //   function(data) {
// //     console.log('Artist albums', data.body);
// //   },
// //   function(err) {
// //     console.error(err);
// //   }
// // );