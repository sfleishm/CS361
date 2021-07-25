// https://medium.com/@bretcameron/how-to-build-a-web-scraper-using-javascript-11d7cd9f77f2

const fetch = require('isomorphic-fetch');
const jsdom = require("jsdom");

// 'use strict';
// const tabletojson = require('tabletojson').Tabletojson;

const { JSDOM } = jsdom;

// Write a scraper function that takes a link 
// and then sends JSON info to console
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
        var str = JSON.stringify(dict, null, 1); // spacing level = 2
        console.log(str);

    }
    else 
    {
        console.log("No link was recognized to scrape");
    }
}

scraper("https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx?data=yield");


// Did not end up using tabletojson, wasn't working right 
// var tabletojson = require('tabletojson').Tabletojson;
// var url = 'http://en.wikipedia.org/wiki/List_of_countries_by_credit_rating';
// const x  = tabletojson.convertUrl(url)
// .then(async function(tablesAsJson) {
//   var standardAndPoorRatings = tablesAsJson[1];
//   var fitchRatings = tablesAsJson[2];
//   return fitchRatings;
// });
// // let thenProm = x.then(value => {
// //     console.log("this gets called after the end of the main stack. the value received and returned is: " + value);
// //     return value;
// // });
// // instantly logging the value of thenProm
// console.log(x());
