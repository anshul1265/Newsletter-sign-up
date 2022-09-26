const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");
const { response } = require('express');
const dotenv = require('dotenv').config();
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// setting up the port to listen
const PORT = process.env.PORT;

// get to the root route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// signing up for the news Letter emails 
app.post("/", function (req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let userEmail = req.body.userEmail;
    // our data object
    var data = {
        members: [
            {
                email_address: userEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    // converting JSON data to plain text
    var jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/e973cfb0d0";
    const options = {
        method: "POST",
        auth: process.env.MY_AUTH,
    };
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

// if the signup fails
app.post("/failure", function(req, res){
    res.redirect("/");
});

// listening to the server
app.listen(PORT, function (req, res) {
    console.log(`server running at port ${PORT}.`);
});