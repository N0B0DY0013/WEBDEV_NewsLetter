
//mailchimp api key: XXXXXX
//listid: XXXXX
//Heroku URL: https://stark-anchorage-84066.herokuapp.com/

const express = require("express");
const body_parser = require("body-parser");
const request_module = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing")

app = express();
app.use(express.static("_public"));
app.use(body_parser.urlencoded({extended: true}));

app.listen(process.env.PORT || "3000", function(req, res) {
    console.log("app is running...");

})

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html")
})

app.post("/", function(req, res) {
    try {

        const first_name = req.body.first_name;
        const last_name = req.body.last_name; 
        const email_address = req.body.email_address;

        const data = {
            members: [{
                email_address: email_address,
                status: "subscribed",
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name,
                }
            }]
        }

        mailchimp.setConfig({
            apiKey: "XXXXX",
            server: "us18",
        });

        const add_audicence = async() => {
            const response = await mailchimp.lists.batchListMembers("XXXXX", data)

            var json_respo = JSON.parse(JSON.stringify(response));

            //console.log("errors", json_respo.errors.length, json_respo.errors);

            //checks the error returned by mailchimp API
            if(json_respo.errors.length) {
                //throw new Error(JSON.stringify(json_respo.errors))
                res.sendFile(__dirname + "/failure.html");
            } else {
                res.sendFile(__dirname + "/success.html");
            }

        };

        add_audicence();
    
    } catch (error) {
        res.sendFile(__dirname + "/failure.html");
    }

});

app.post("/failure", function(req, res) {

    res.redirect("/");

});

app.post("/success", function(req, res) {

    res.redirect("/");

});

