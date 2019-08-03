require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var input = process.argv[3];
fs.appendFileSync("log.txt", command + " " + input + "\n");

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
        console.log("\n\nLIRI Bot is a Language Interpretation and Recognition Interface.  \nPlease input the correct commands. . .  Silly humans.");
        fs.appendFileSync("log.txt", "\n\nLIRI Bot is a Language Interpretation and Recognition Interface.  \nPlease input the correct commands. . .  Silly humans.");
    }
}

function concert(artist) {
    //var artist = "Blink-182";
    if (artist === undefined) {
        artist = "blink-182";
        console.log("LIRI Bot says invalid input.  \nLIRI Bot is looking up blink-182.\n");
        fs.appendFileSync("log.txt", "LIRI Bot says invalid input.  \nLIRI Bot is looking up blink-182.\n");
    }
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl)
    .then(function(data) {
        var count;
        for (var i = 0; i < 10; i++) {
            count = i + 1;
            console.log("\n=========================");
            fs.appendFileSync("log.txt", "\n=========================\n");
            console.log(count);
            fs.appendFileSync("log.txt", count + "\n");
            console.log("Venue: " + data.data[i].venue.name);
            fs.appendFileSync("log.txt", "Venue: " + data.data[i].venue.name + "\n");
            if (data.data[i].venue.region != "") {
                console.log("Location: " + data.data[i].venue.city + ", " + data.data[i].venue.region);
                fs.appendFileSync("log.txt", "Location: " + data.data[i].venue.city + ", " + data.data[i].venue.region + "\n");
            } else {
                console.log("Location: " + data.data[i].venue.city + ", " + data.data[i].venue.country);
                fs.appendFileSync("log.txt", "Location: " + data.data[i].venue.city + ", " + data.data[i].venue.country + "\n");
            }
            var day = data.data[i].datetime;
            var day = moment(data.data[i].datetime).format("MM/DD/YYYY");
            console.log("Date: " + day);
            fs.appendFileSync("log.txt", "Date: " + day + "\n");
            console.log("=========================");
            fs.appendFileSync("log.txt", "=========================\n");
        }
    }).catch(function(error) {
        console.log("\n\nHuman Error.  Processing. . .");
        fs.appendFileSync("log.txt", "\n\nHuman Error.  Processing. . ." + "\n");
        console.log("Error: " + error);
        fs.appendFileSync("log.txt", "Error: " + error + "\n");
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
            fs.appendFileSync("log.txt", "\n=========================" + "\n");
            var results = data.tracks.items;
            console.log("Artist(s): " + results[0].artists[0].name);
            fs.appendFileSync("log.txt", "Artist(s): " + results[0].artists[0].name + "\n");
            console.log("Track: " + results[0].name);
            fs.appendFileSync("log.txt", "Track: " + results[0].name + "\n");
            console.log("Preview URL: " + results[0].preview_url);
            fs.appendFileSync("log.txt", "Preview URL: " + results[0].preview_url + "\n");
            console.log("Album: " + results[0].album.name);
            fs.appendFileSync("log.txt", "Album: " + results[0].album.name + "\n");
            console.log("=========================");
            fs.appendFileSync("log.txt", "=========================" + "\n");
        } else {
            var results = data.tracks.items;
            for (var i = 0; i < results.length; i++) {
                count = i + 1;
                console.log("\n=========================");
                fs.appendFileSync("log.txt", "\n=========================" + "\n");
                console.log(count);
                fs.appendFileSync("log.txt", count + "\n");
                var singers = [];
                for(var j = 0; j < results[i].artists.length; j++) {
                    singers.push(" " + results[i].artists[j].name);
                }
                console.log("Artist(s):" + singers);
                fs.appendFileSync("log.txt", "Artist(s):" + singers + "\n");
                console.log("Track: " + results[i].name);
                fs.appendFileSync("log.txt", "Track: " + results[i].name + "\n");
                console.log("Preview URL: " + results[i].preview_url);
                fs.appendFileSync("log.txt", "Preview URL: " + results[i].preview_url + "\n");
                console.log("Album: " + results[i].album.name);
                fs.appendFileSync("log.txt", "Album: " + results[i].album.name + "\n");
                console.log("=========================");
                fs.appendFileSync("log.txt", "=========================" + "\n");
            }
        }
        }).catch(function(error) {
        console.log("\n\nHuman Error.  Processing. . .");
        fs.appendFileSync("log.txt", "\n\nHuman Error.  Processing. . ." + "\n");
        console.log("Error: " + error);
        fs.appendFileSync("log.txt", "Error: " + error + "\n");
    }).finally(function() {
        completed();
    });
};

function movie(movieName) {
    if (movieName === undefined) {
        movieName = "Mr. Nobody";
        console.log("If you haven't watched " + '"Mr. Nobody"' + ", then you should: http://www.imdb.com/title/tt0485947/");
        fs.appendFileSync("log.txt", "If you haven't watched " + '"Mr. Nobody"' + ", then you should: http://www.imdb.com/title/tt0485947/" + "\n");
        console.log("Unfortunately, they removed it from Netflix, but rent it at your local BlockBuster.\n");
        fs.appendFileSync("log.txt", "Unfortunately, they removed it from Netflix, but rent it at your local BlockBuster.\n" + "\n");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl)
    .then(function(data) {
        if (data.data.Title != undefined) {
            console.log("=========================");
            fs.appendFileSync("log.txt", "=========================" + "\n");
            console.log("Title: " + data.data.Title);
            fs.appendFileSync("log.txt", "Title: " + data.data.Title + "\n");
            console.log("Release Year: " + data.data.Year);
            fs.appendFileSync("log.txt", "Release Year: " + data.data.Year + "\n");
            console.log(data.data.Ratings[0].Source + ": " + data.data.Ratings[0].Value);
            fs.appendFileSync("log.txt", data.data.Ratings[0].Source + ": " + data.data.Ratings[0].Value + "\n");
            console.log(data.data.Ratings[1].Source + ": " + data.data.Ratings[1].Value);
            fs.appendFileSync("log.txt", data.data.Ratings[1].Source + ": " + data.data.Ratings[1].Value + "\n");
            console.log("Country Produced: " + data.data.Country);
            fs.appendFileSync("log.txt", "Country Produced: " + data.data.Country + "\n");
            console.log("Language: " + data.data.Language);
            fs.appendFileSync("log.txt", "Language: " + data.data.Language + "\n");
            console.log("Plot: " + data.data.Plot);
            fs.appendFileSync("log.txt", "Plot: " + data.data.Plot + "\n");
            console.log("Actors: " + data.data.Actors);
            fs.appendFileSync("log.txt", "Actors: " + data.data.Actors + "\n");
            console.log("=========================");
            fs.appendFileSync("log.txt", "=========================" + "\n");
            completed();
        } else {
            //This isn't redundant.  It catches misspellings, etc. . .
            var movieName = "Mr.Nobody";
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

            axios.get(queryUrl)
            .then(function(data) {
                var wQuotes = '"Mr. Nobody"';
                console.log("Movie not found.");
                fs.appendFileSync("log.txt", "Movie not found." + "\n");
                console.log("If you haven't watched " + wQuotes + ", then you should: http://www.imdb.com/title/tt0485947/");
                fs.appendFileSync("log.txt", "If you haven't watched " + wQuotes + ", then you should: http://www.imdb.com/title/tt0485947/" + "\n");
                console.log("Unfortunately, they removed it from Netflix, but rent it at your local BlockBuster.\n");
                fs.appendFileSync("log.txt", "Unfortunately, they removed it from Netflix, but rent it at your local BlockBuster.\n" + "\n");
                console.log("=========================");
                fs.appendFileSync("log.txt", "=========================" + "\n");
                console.log("Title: " + data.data.Title);
                fs.appendFileSync("log.txt", "Title: " + data.data.Title + "\n");
                console.log("Release Year: " + data.data.Year);
                fs.appendFileSync("log.txt", "Release Year: " + data.data.Year + "\n");
                console.log(data.data.Ratings[0].Source + ": " + data.data.Ratings[0].Value);
                fs.appendFileSync("log.txt", data.data.Ratings[0].Source + ": " + data.data.Ratings[0].Value + "\n");
                console.log(data.data.Ratings[1].Source + ": " + data.data.Ratings[1].Value);
                fs.appendFileSync("log.txt", data.data.Ratings[1].Source + ": " + data.data.Ratings[1].Value + "\n");
                console.log("Country Produced: " + data.data.Country);
                fs.appendFileSync("log.txt", "Country Produced: " + data.data.Country + "\n");
                console.log("Language: " + data.data.Language);
                fs.appendFileSync("log.txt", "Language: " + data.data.Language + "\n");
                console.log("Plot: " + data.data.Plot);
                fs.appendFileSync("log.txt", "Plot: " + data.data.Plot + "\n");
                console.log("Actors: " + data.data.Actors);
                fs.appendFileSync("log.txt", "Actors: " + data.data.Actors + "\n");
                console.log("=========================");
                fs.appendFileSync("log.txt", "=========================" + "\n");
            }).finally(function() {
                completed();
            });
        }
    }).catch(function(error) {
        console.log("\n\nHuman Error.  Processing. . .");
        fs.appendFileSync("log.txt", "\n\nHuman Error.  Processing. . ." + "\n");
        console.log("Error: " + error);
        fs.appendFileSync("log.txt", "Error: " + error + "\n");
    });
};

function completed() {
    console.log("\n\nCollecting ALL your data.");
    fs.appendFileSync("log.txt", "\n\nCollecting ALL your data." + "\n");
    console.log("LIRI Bot thanks you for teaching it how to be human.");
    fs.appendFileSync("log.txt", "LIRI Bot thanks you for teaching it how to be human." + "\n\n\n");
}


function LiriSays() {
    fs
    .readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            fs.appendFileSync("log.txt", "Error: " + error + "\n");
            return console.log("Error: " + error);
        } else {
            console.log(data);
            fs.appendFileSync("log.txt", data + "\n");

            if (data.includes(",")) {
                var str = data.indexOf(",");
                var command = data.slice(0, str);
                var input = data.slice(str + 1);
                if (command === "do-what-it-says") {
                    console.log("Command: " + command);
                    fs.appendFileSync("log.txt", "Command: " + command + "\n");
                    console.log("LIRI Bot says you cannot do that.  \nAre you trying to break LIRI Bot?  \nLIRI Bot does not like that.  \nLIRI Bot does NOT forget.");
                    fs.appendFileSync("log.txt", "LIRI Bot says you cannot do that.  \nAre you trying to break LIRI Bot?  \nLIRI Bot does not like that.  \nLIRI Bot does NOT forget." + "\n");
                } else {
                    instructions(command, input);
                }
            } else {
                //This is if you put command input
                var str = data.indexOf(" ");
                var command = data.slice(0, str);
                var input = data.slice(str + 1);
                if (command === "do-what-it-says") {
                    console.log("Command: " + command);
                    fs.appendFileSync("log.txt", "Command: " + command + "\n");
                    console.log("LIRI Bot says you cannot do that.  \nAre you trying to break LIRI Bot?  \nLIRI Bot does not like that.  \nLIRI Bot does NOT forget.");
                    fs.appendFileSync("log.txt", "LIRI Bot says you cannot do that.  \nAre you trying to break LIRI Bot?  \nLIRI Bot does not like that.  \nLIRI Bot does NOT forget." + "\n");
                } else {
                    instructions(command, input);
                }
            }   
        }
    });
}; 