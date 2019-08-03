require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var input = process.argv[3];
instructions(command, input);

function instructions(command, input) {
    if (command === "concert-this") {
        concert(input);
    } else if (command === "spotify-this-song") {
        music(input);
    } else if (command === "movie-this") {
        movie(input);
    } else if (command === "do-what-it-says") {
        LiriSays(input);
    } else {
        console.log("LIRI Bot is a Language Interpretation and Recognition Interface.  \nPlease input the correct commands. . .  Silly humans.");
    }
}

function concert(artist) {
    //var artist = "Blink-182";
    if (artist === undefined) {
        artist = "blink-182";
        console.log("LIRI Bot says invalid input.  \nLIRI Bot is looking up blink-182.\n");
    }
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl)
    .then(function(data) {
        var count;
        for (var i = 0; i < 10; i++) {
            count = i + 1;
            console.log("\n=========================");
            console.log(count);
            console.log("Venue: " + data.data[i].venue.name);
            if (data.data[i].venue.region != "") {
                console.log("Location: " + data.data[i].venue.city + ", " + data.data[i].venue.region);
            } else {
                console.log("Location: " + data.data[i].venue.city + ", " + data.data[i].venue.country);
            }
            var day = data.data[i].datetime;
            var day = moment(data.data[i].datetime).format("MM/DD/YYYY");
            console.log("Date: " + day);
            console.log("=========================");
        }
    }).catch(function(error) {
        console.log("\n\nHuman Error.  Processing. . .");
        console.log("Error: " + error);
    }).finally(function() {
        completed();
    });
};


function music(song) {
    if (song === undefined) {
        song = "The Sign Ace of Base";
    }
    spotify.search({
        type: "track",
        query: song,
        limit: 10
    }).then(function(data) {
        var count;
        if (song === "The Sign Ace of Base") {
            console.log("\n=========================");
            console.log(1);
            var results = data.tracks.items;
            console.log("Artist(s): " + results[0].artists[0].name);
            console.log("Track: " + results[0].name);
            console.log("Preview URL: " + results[0].preview_url);
            console.log("Album: " + results[0].album.name);
            console.log("=========================");
        } else {
            var results = data.tracks.items;
            for (var i = 0; i < results.length; i++) {
                count = i + 1;
                console.log("\n=========================");
                console.log(count);
                var singers = [];
                for(var j = 0; j < results[i].artists.length; j++) {
                    singers.push(" " + results[i].artists[j].name);
                }
                console.log("Artist(s):" + singers);
                console.log("Track: " + results[i].name);
                console.log("Preview URL: " + results[i].preview_url);
                console.log("Album: " + results[i].album.name);
                console.log("=========================");
            }
        }
        }).catch(function(error) {
        console.log("\n\nHuman Error.  Processing. . .");
        console.log("Error: " + error);
    }).finally(function() {
        completed();
    });
};

function movie(movieName) {
    if (movieName === undefined) {
        movieName = "Mr. Nobody";
        console.log("If you haven't watched " + '"Mr. Nobody"' + ", then you should: http://www.imdb.com/title/tt0485947/");
        console.log("Unfortunately, they removed it from Netflix, but rent it at your local BlockBuster.\n");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl)
    .then(function(data) {
        if (data.data.Title != undefined) {
            console.log("=========================");
            console.log("Title: " + data.data.Title);
            console.log("Release Year: " + data.data.Year);
            console.log(data.data.Ratings[0].Source + ": " + data.data.Ratings[0].Value);
            console.log(data.data.Ratings[1].Source + ": " + data.data.Ratings[1].Value);
            console.log("Country Produced: " + data.data.Country);
            console.log("Language: " + data.data.Language);
            console.log("Plot: " + data.data.Plot);
            console.log("Actors: " + data.data.Actors);
            console.log("=========================");
            completed();
        } else {
            //This isn't redundant.  It catches misspellings, etc. . .
            var movieName = "Mr.Nobody";
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

            axios.get(queryUrl)
            .then(function(data) {
                var wQuotes = '"Mr. Nobody"';
                console.log("Movie not found.");
                console.log("If you haven't watched " + wQuotes + ", then you should: http://www.imdb.com/title/tt0485947/");
                console.log("Unfortunately, they removed it from Netflix, but rent it at your local BlockBuster.\n");
                console.log("=========================");
                console.log("Title: " + data.data.Title);
                console.log("Release Year: " + data.data.Year);
                console.log(data.data.Ratings[0].Source + ": " + data.data.Ratings[0].Value);
                console.log(data.data.Ratings[1].Source + ": " + data.data.Ratings[1].Value);
                console.log("Country Produced: " + data.data.Country);
                console.log("Language: " + data.data.Language);
                console.log("Plot: " + data.data.Plot);
                console.log("Actors: " + data.data.Actors);
                console.log("=========================");
            }).finally(function() {
                completed();
            });
        }
    }).catch(function(error) {
        console.log("\n\nHuman Error.  Processing. . .");
        console.log("Error: " + error);
    });
};

function completed() {
    console.log("\n\nCollecting ALL your data.");
    console.log("LIRI Bot thanks you for teaching it how to be human.");
}


function LiriSays() {
    fs
    .readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log("Error: " + error);
        } else {
            console.log(data);
            var str = data.indexOf(" ");
            var command = data.slice(0, str);
            var input = data.slice(str + 1);
            if (command === "do-what-it-says") {
                console.log("Command: " + command);
                console.log("LIRI Bot says you cannot do that.  \nAre you trying to break LIRI Bot?  \nLIRI Bot does not like that.  \nLIRI Bot does NOT forget.")
            } else {
                instructions(command, input);
            }
        }
    });
}; 