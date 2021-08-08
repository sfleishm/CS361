const dotenv = require('dotenv').config(); 
var express = require('express');

var app = express();
var cors = require('cors');
app.use(cors({origin: true}));

// var handlebars = require('express-handlebars').create({defaultLayout:'main'}); //Working locally
var handlebars = require('express-handlebars').create({defaultLayout:'main', layoutsDir: "./views/layouts"}); // Testing to see if this will work with heroku
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set("views", "views"); // Added to see if this works with heroku
// app.set('port', 5231);

app.use(express.static('public'))

const apiKey = process.env.LASTFM_APIKEY;

const searchScript = require('./public/scripts/searchScript.js');

// exports.dotenv = process.env.LASTFM_APIKEY;

// SCRAPER STUFF
const fetch = require('isomorphic-fetch');
const jsdom = require("jsdom");
// const { query } = require('express');
const { JSDOM } = jsdom;

// const apiKey = ;
//Home View
app.get('/home',function(req,res,next){
    var context = {};
    res.render('home', context);
    }
);

app.get('/api', function(req,res,next)
    {
        get_query = []

        for (var q in req.query) {
            get_query.push({'key':q, 'value':req.query[q]})
        }

        var context = {};
        // var context = {};

        // context.dataList = get_query;

        // console.log('hello world')
        // console.log(req.query)

        // res.render('api', context)
        async function scraper(link) {
            // If link is X do scraping for x specific website
            // If link is Y etc. etc. 
            // First link that mark sent over is this one https://discord.com/channels/856754424865095690/856754424865095693/868270947138961418
            if (link == 'https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx?data=yield') 
            {
                const response = await fetch(link);
                const text = await response.text();
                const dom = await new JSDOM(text);
        
                fin_rates_table = dom.window.document.querySelector("#t-content-main-content > div > table > tbody > tr > td > div > table > tbody");
        
                var firstRow = fin_rates_table.firstChild;
                // Grab # of columns (Excluding the date column)
                var columnCount = firstRow.childElementCount;
                var rowCount = fin_rates_table.childElementCount;
        
                console.log(rowCount);
                var dateColumn = fin_rates_table.firstChild.firstChild;
                console.log(dateColumn);
                // console.log(JSON.stringify(fin_rates_table.innerHTML));
                var dict = {};
                dict["Date"] = {};
                console.log(dict);
        
                dateObject = dict["Date"];
        
                var currentColumn = dateColumn;
        
                var currentRow = firstRow;
                for (let i = 1; i < rowCount; i++) 
                {
                    currentRow = currentRow.nextElementSibling;
                    currentRowName = currentRow.firstChild.innerHTML;
                    // Append our dates as a new Key to the Date Value
                    // with an empty dict object
                    dict["Date"][currentRowName] = {};
        
                    // 
                    var currentColumn = dateColumn;
                    var nextItemInRow = currentRow.firstChild;
                    for (let j = 1; j < columnCount; j++) {
                        currentColumn = currentColumn.nextElementSibling;
                        nextItemInRow = nextItemInRow.nextElementSibling;
                        value = nextItemInRow.innerHTML;
                        // console.log(value)
                        let newKey = {};
                        let currentName = currentColumn.innerHTML;
                        dict["Date"][currentRowName][currentName] = value;
                    }
                    
                    
                }
        
                // console.log(dict);
                // var str = JSON.stringify(dict, null, 2); // spacing level = 2
                // console.log(str);
                return dict;
        
            }
            else 
            {
                const response = await fetch(link);
                const text = await response.text();
                const dom = await new JSDOM(text);
        
                fin_rates_table = dom.window.document.querySelector("#t-content-main-content > div > table > tbody > tr > td > div > table > tbody");
            
                var firstRow = fin_rates_table.firstChild;
                // Grab # of columns (Excluding the date column)
                var columnCount = firstRow.childElementCount;
                var rowCount = fin_rates_table.childElementCount;
        
                console.log(rowCount);
                var dateColumn = fin_rates_table.firstChild.firstChild;
                console.log(dateColumn);
                // console.log(JSON.stringify(fin_rates_table.innerHTML));
                var dict = {};
                dict["Date"] = {};
                console.log(dict);
        
                dateObject = dict["Date"];
        
                var currentColumn = dateColumn;
        
                var currentRow = firstRow;
                for (let i = 1; i < rowCount; i++) 
                {
                    currentRow = currentRow.nextElementSibling;
                    currentRowName = currentRow.firstChild.innerHTML;
                    // Append our dates as a new Key to the Date Value
                    // with an empty dict object
                    dict["Date"][currentRowName] = {};
        
                    // 
                    var currentColumn = dateColumn;
                    var nextItemInRow = currentRow.firstChild;
                    for (let j = 1; j < columnCount; j++) {
                        currentColumn = currentColumn.nextElementSibling;
                        nextItemInRow = nextItemInRow.nextElementSibling;
                        value = nextItemInRow.innerHTML;
                        // console.log(value)
                        let newKey = {};
                        let currentName = currentColumn.innerHTML;
                        dict["Date"][currentRowName][currentName] = value;
                    }
                }
        
                // console.log(dict);
                // var str = JSON.stringify(dict, null, 2); // spacing level = 2
                // console.log(str);
                // return str;
                return "Parameter not passed correctly";
            }
        }
        async function asyncCall() {
            console.log('caling')
            // let data = await scraper("https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx?data=yield")
            
            var link = get_query[0].value;
            let data = await scraper(link);
            context.dataList = data;
            // console.log(get_query[0].value);
            console.log('hello world')
            console.log(req.query)
            console.log(data);

            // res.render('api', context)
            res.status(200).json({
                data
            });
            console.log('done')
        }
        asyncCall();
    }
)

app.get('/artistTracks', async function(req,res,next){
    // console.log(req.query);
    // console.log(req.query['artist']);
    var toptracks = await searchScript.artistSearch(req.query['artist'], apiKey);
    searchScript.sayHi();
    res.status(200).json({
        toptracks
    });
});

// Route for handling last.fm track.search
app.get('/songs', async function(req,res,next){
    // console.log(req.query);
    // console.log(req.query['track']);
    var results = await searchScript.songSearch(req.query['track'], apiKey);
    searchScript.sayHi();
    res.status(200).json({
        results
    });
})

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(process.env.PORT || 5231, function(){
    console.log('Express started on http://localhost:' + '5231' + '/home' + '; press Ctrl-C to terminate.');
});

