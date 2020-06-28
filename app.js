// to install it put "npm install express" in the hyper terninal
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //species our static folders so the css styles will provided to the server

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const userEmail = req.body.email;

  var data = {
    members: [{
      email_address: userEmail,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]

  };

  const jsonData = JSON.stringify(data); //turn an javascript object to string

  const url = "https://us10.api.mailchimp.com/3.0/lists/2668f17e45";
  var options = {
    method: "POST",
    auth: "diana1:8d3f75f3b325a184342972f36c4a318a-us10"
  };

  //https.request(url[, options][, callback])   -----   Makes a request to a secure web server
  const request = https.request(url, options, function(response) {


    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

  });
  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

//8d3f75f3b325a184342972f36c4a318a-us10
// list id 2668f17e45
