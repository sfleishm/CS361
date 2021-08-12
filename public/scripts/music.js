// Load from .env
document.addEventListener('DOMContentLoaded', onSearchBarClick)
document.addEventListener('DOMContentLoaded', removeItem)

// // Default SortableJS
// import Sortable from 'sortablejs';

// // Core SortableJS (without default plugins)
// import Sortable from 'sortablejs/modular/sortable.core.esm.js';

// // Complete SortableJS (with all plugins)
// import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

// // List with handle
// Sortable.create(added-song-list, {
//   handle: '.my-handle',
//   animation: 150
// });


// Do something with the search button is hit
async function onSearchBarClick() {
  document.getElementById('search-button').addEventListener('click', function(event)
    {
      // getToken();
      // initSpotifyWrapper();
      clearSearchList();
      console.log("hi");
      var searchRadio = getSearchCriteria();
      if (searchRadio === "artist")
      {
        // Add artist search tracks
        addAristTopTracks();
      }
      else if (searchRadio === "song")
      {
        // Add song search tracks
        addSongTrcks();
      }
      event.preventDefault();
      return false;
    }
  )
}

function removeItem()
{
  document.getElementById('deleteMe').addEventListener('click', function(event)
    {
      var currentElement = window.event;
      currentElement.remove();
    }
  )
}
// Grab the radio value for the search result
function getSearchCriteria()
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
async function addAristTopTracks()
{
  var jsonResult = await artistSearch();
  var songList = jsonResult.track;
  var attributes = jsonResult["@attr"];
  console.log(attributes);
  var divList = document.getElementById('search-result-lists');
  for (let i = 0; i < 11; i ++)
  {
    var hyperNode = document.createElement("button");
    var linkText = document.createTextNode(songList[i].name + ' - ' + attributes.artist);

    hyperNode.appendChild(linkText);
    hyperNode.onclick = addToUserList;
    hyperNode.className = "list-group-item list-group-item-action";
    hyperNode.title = "my title test";
    hyperNode.href = "google.com";
  
    divList.appendChild(hyperNode);
  }
}

async function addSongTrcks()
{
  var songList = await songSearch();
  var songList = songList.track;
  var divList = document.getElementById('search-result-lists');
  for (let i = 0; i < 11; i ++)
  {
    var hyperNode = document.createElement("button");
    var linkText = document.createTextNode(songList[i].name + ' - ' + songList[i].artist);

    hyperNode.appendChild(linkText);
    hyperNode.onclick = addToUserList;
    hyperNode.className = "list-group-item list-group-item-action";
    hyperNode.title = "my title test";
    hyperNode.href = "google.com";
  
    divList.appendChild(hyperNode);
  } 
}

function getSearchText()
{
  var searchText = document.getElementById('music_search');
  var text = searchText.value;
  return text;
}

// Clear the song list
async function clearSearchList()
{
  document.getElementById('search-result-lists').innerHTML = "";
}

// Function to send selected song (button) down to the user created list
function addToUserList()
{
  var userList = document.getElementById('added-song-list');

  var currentElement = window.event;
  var text = currentElement.target.innerHTML;

  var addedSong = document.createElement("button");
  addedSong.className = "list-group-item list-group-item-action";

  var songText = document.createTextNode(text);
  addedSong.appendChild(songText);
  userList.appendChild(addedSong);

  // var addedSong = document.createElement("ul");
  // addedSong.className = "list-group list-group-horizontal";
  // var songText = document.createElement("li");
  // songText.className = "list-group-item";
  // songText.innerHTML = text;
  // var deleteButton = document.createElement("button");
  // deleteButton.id = 'deleteMe';

  // addedSong.appendChild(songText);
  // addedSong.appendChild(deleteButton);
  // userList.appendChild(addedSong);
}

// REF: https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
async function artistSearch() 
{
  var searchResult = getSearchText();
  var basicPath = "/artistTracks?";
  var method = `artist=${searchResult}`;
  
  var completePath = basicPath + method;

  const response = await fetch(completePath);
  const text = await response.json();
  console.log(text);
  return text.toptracks;
}

async function songSearch()
{
  var searchResult = getSearchText();
  var basicPath = "/songs?";
  var method = `track=${searchResult}`;
  
  var completePath = basicPath + method;

  const response = await fetch(completePath);
  const text = await response.json();
  console.log(text.results.trackmatches);
  return text.results.trackmatches;
  // return text.
  // return text.resul.toptracks.track;
}

