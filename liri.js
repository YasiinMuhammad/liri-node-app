require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js")
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require("moment");
var appCommand = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");

function liriRun(appCommand, userSearch) {
    switch (appCommand) {
        case "spotify-this-song":
            getSpotify(userSearch)
            break;

        case "movie-this":
            getMovies(userSearch)
            break;

        case "concert-this":
            getBandsInTown(userSearch)
            break;

        case "do-what-it-says":
            doWhatItSays(userSearch)
            break;


    }
};

// -------------Movies------------
function getMovies(name) {
    if (name == "") {
        name = "Mr.nobody"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {
            console.log("Release Year: " + response.data.Year);
            console.log("title: " + response.data.Title);
            console.log("Release Year: " + response.data.Rated);
            console.log("Release Year: " + response.data.imbdRating);
            if (response.data.Rating) {
                console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);

            }
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("Box Office: " + response.data.BoxOffice);

            var logMovie = "Logging" + "\nMovie title:" + response.data.Title;
            fs.appendFile("log.txt", logMovie, function (err) {

                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                }

                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                    console.log("Content Added!");
                }
            }


            );
        })
};

// -----------Spotify-------------


function getSpotify(name) {
    var spotify = new Spotify(keys.spotify);
    if (!name) {
        name = "monster";
    }

    spotify.search(
        {
            type: "track",
            query: name
        },
        function (error, response) {
            if (error) {
                console.log(error);
                return;
            }
            var songs = response.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log("Song Name: " + songs[i].name);
                var artistArray = songs[i].artists;
                var artist = [];
                for (var j = 0; j < artistArray.length; j++) {
                    artist.push(artistArray[j].name);
                }
                console.log("artist: " + artist.join(", "));
                console.log("preview: " + songs[i].preview_url);
                console.log("Album Name: " + songs[i].album.name);

                //     var logSong = "Logging" + "\nArtist:" + data.tracks.items[0].album.artist[0].name;

                // fs.appendFile("log.txt", logSong, function(err) {

                //     // If an error was experienced we will log it.
                //     if (err) {
                //       console.log(err);
                //     }

                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                // else {
                //   console.log("Content Added!");
                // }

                //   });


            }
        }
    )
};
// --------------- Bands in town ---------------

function getBandsInTown(artist) {
    var artist = userSearch;
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(queryUrl).then(
        function (response) {
            console.log(queryUrl);
            console.log("Venue: " + response.data[0].venue.name);
            console.log("Location: " + response.data[0].venue.city); console.log("Date: " + moment(response.data[0].datetime).format("MMM Do YY"));


        });
};

function doWhatItSays(artist){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);
      
      });
}
liriRun(appCommand, userSearch)