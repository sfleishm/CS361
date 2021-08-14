// Load from .env
document.addEventListener('DOMContentLoaded', onSearchBarClick)
// document.addEventListener('DOMContentLoaded', removeItem)
document.addEventListener('DOMContentLoaded', addedSongListDelegation)


// Do something with the search button is hit
async function onSearchBarClick() {
  document.getElementById('search-button').addEventListener('click', function(event)
    {
      clearSearchList();
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

function addedSongListDelegation(){
  document.getElementById("added-song-list").addEventListener('click', function(event){
    var target = event.target;
    if (target.id == "deleteButton") {
      console.log('hit me');
      removeItem(target);
      target.innerHTML = " ";
    }
  })
}

async function removeItem(target)
{
  var item = target;
  item.parentElement.parentElement.remove();
  
  var status = await getUserListStatus();
  if (status) {
    clearUserList();
  }
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

// Clear the delete export row
function clearDeleteExport()
{
  document.getElementById('deleteButton').innerHTML = "";
  document.getElementById('exportButton').innerHTML = "";
}

// If the user list is empty return true
// If the user list has something in it return false
async function getUserListStatus()
{
  var childCount = document.getElementById("added-song-list").childElementCount;

  if (childCount == 0) {
    return true;
  }
  else {
    return false;
  }
}

// If the user song list is not empty, do this function 
// which will add a list item row with a delete and export button
function addDeleteExportRow()
{
  // ADD DELETE BUTTON
  var deleteDiv = document.getElementById('deleteButton');

  var deleteItem = document.createElement("button");
  deleteItem.className = "btn btn-danger";
  deleteItem.id = "clear-list";
  deleteItem.onclick = clearUserList;

  var deleteText = document.createTextNode("CLEAR USER LIST");
  deleteItem.appendChild(deleteText);
  deleteDiv.appendChild(deleteItem);  
  // ADD EXPORT BUTTON 
  var exportDiv = document.getElementById('exportButton');

  var exportItem = document.createElement("button");
  exportItem.className = "btn btn-light";
  exportItem.onclick = exportToText;

  var exportText = document.createTextNode("EXPORT ME");
  exportItem.appendChild(exportText);
  exportDiv.appendChild(exportItem); 

}

// Clear the user generated list 
// then clear the delete export row since we dont want those showing when
// there is nothing to delete / export
function clearUserList()
{
  document.getElementById('added-song-list').innerHTML = "";
  clearDeleteExport(); 
}

// Function to send selected song (button) down to the user created list
async function addToUserList()
{
  // Add Delete Export Row if its the first song add
  var tF = await getUserListStatus();
  if (tF){
    addDeleteExportRow();
  }

  var userList = document.getElementById('added-song-list');

  var currentElement = window.event;
  var text = currentElement.target.innerHTML;

  var addedSong = document.createElement("button");
  addedSong.className = "list-group-item list-group-item-action";

  var songText = document.createTextNode(text);
  addedSong.appendChild(songText);
  userList.appendChild(addedSong);

  createDeleteButtonForUserList(addedSong);
}

// Creates the delete button for the user list
// then takes the parameter addedSongDiv so that we can append
// our newly created remove button
function createDeleteButtonForUserList(addedSongDiv)
{
  var deleteSpan = document.createElement("span");
  deleteSpan.className = "pull-right button-group";
  var deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger";
  deleteButton.id = "deleteButton";
  deleteButton.innerHTML = "Remove";
  var removeSpan = document.createElement("span");
  removeSpan.className = "glyphicon glyphicon-remove";
  removeSpan.value = "Delete";

  deleteButton.appendChild(removeSpan);
  deleteSpan.appendChild(deleteButton);
  addedSongDiv.appendChild(deleteSpan);
}

async function getUserList()
{
  var userSongList = document.getElementById('added-song-list');
  var firstEl = userSongList;
  return firstEl;
}

// REF: https://stackoverflow.com/questions/56284370/remove-self-element-onclick
function removeMe()
{
  console.log('hi');
  var currentElement = window.event;                                            
  console.log(currentElement);
  currentElement.remove;      
  
}

async function exportToText()
{
  var firstEl = await getUserList();
  var childCount = firstEl.childElementCount;
  clearExportList();
  createExportUserList(firstEl, childCount);
  console.log(childCount);
  console.log('hi');
  console.log(firstEl);
}

function createExportUserList(userListDiv, childCount)
{
  console.log("UserDivList", userListDiv, " child count", childCount);
  var exportedArea = document.getElementById("exportedList");

  var listParagraph = document.createElement("p");
  listParagraph.innerHTML = "Here's your list! Select the text and copy to your friends :)";
  exportedArea.appendChild(listParagraph);

  var firstChildDiv = userListDiv.firstChild.nextSibling; // this locks onto our button
  // Loop over all the children elements
  for (let i = 0; i < childCount; i++)
  {
    var songArtist = firstChildDiv.textContent;
    songArtist = songArtist.substring(0, songArtist.length - 6);
    
    var unorderedList = document.createElement("ul");
    unorderedList.innerHTML = songArtist;
    exportedArea.appendChild(unorderedList);

    firstChildDiv = firstChildDiv.nextSibling;
  }
  
}

function clearExportList()
{
  document.getElementById('exportedList').innerHTML = " ";
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
}

