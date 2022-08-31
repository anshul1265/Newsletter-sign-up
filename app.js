const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");
const { response } = require('express');
// added a comment

// used to hide
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path : "./config.env" });


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let userEmail = req.body.userEmail;
    // console.log(firstName);
    // console.log(lastName);
    // console.log(userEmail);

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

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT, function (req, res) {
    console.log(`server running at port ${process.env.PORT}.`);
});

// list id : e973cfb0d0