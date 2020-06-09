//jshint eversion: 6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");


const app = express();

// In order to use static pages such as styles.css or the image file, this is necessary
//IMPORTANT NOTE: now the root folder for styles.css and images is public instead of home directory
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

//Up until this point, it is more like a boilerplate that every project requires
//You may save this and copy paste it for future use

//get route

// "/" refers to the homepage AKA home route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


//In order for the action to be triggered, form in html must have action = "/" and method = "POST"
app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/73d983be25";

    const options = {
        method: "post",
        auth: "bibhor1:a4e416d66721ee454d89093729f2b6af-us10"
    }

    const request = https.get(url, options, function (response) {

        if (response.statusCode === 200) {
            res.send(__dirname + "/success.html");
        } else {
            res.send(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
})


//dynamic port used by heroku - process.env.PORT, 
//heroku will automatically choose a port to deploy the ap
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

// API Key
// a4e416d66721ee454d89093729f2b6af-us10

// List ID AKA Audience ID
// 73d983be25