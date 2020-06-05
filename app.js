
const express = require("express");
const scraper = require("./scraper");
const app = express();

// use the express-static middleware
app.use(express.static("public"))

// TODO: aggiugnere una view
// set the view engine to ejs
// app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.send("<h1> CUSTOM API (LiberoQuotidiano scraping) v 0.1 </h1>")
})

app.get('/liberoquotidiano', function (req, res) {
    scraper.fetch("https://www.liberoquotidiano.it/").then( function callback(something) {
    return res.json(something);
    })
  })

// start the server listening for requests
app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));