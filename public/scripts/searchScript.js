const basicPath = "http://ws.audioscrobbler.com/2.0/?method=";

module.exports.artistSearch = async function artistSearch(searchEntry, apiKey) 
{
//   var basicPath = "http://ws.audioscrobbler.com/2.0/?method=";
  //   artist.gettoptracks&
    var method = "artist.gettoptracks&"
    var artist = `artist=${searchEntry}&`;
    var api = `api_key=${apiKey}&`
    var basicPathEnd = "format=json";

    var completePath = basicPath + method + artist + api + basicPathEnd;

    const response = await fetch(completePath);
    const text = await response.json();
    return text.toptracks;
    //   console.log(text.toptracks.track[0].name);
    //   return text.toptracks.track;
}

module.exports.songSearch = async function songSearch(searchEntry, apiKey)
{
    var method = "track.search&"
    var artist = `track=${searchEntry}&`;
    var api = `api_key=${apiKey}&`
    var basicPathEnd = "format=json";

    var completePath = basicPath + method + artist + api + basicPathEnd;
    const response = await fetch(completePath);
    const text = await response.json();
    return text.results;
}

module.exports.sayHi = function()
{
    console.log('hi');
}