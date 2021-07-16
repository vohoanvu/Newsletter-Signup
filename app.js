const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

    //flattening the request data object
    const jsonData = JSON.stringify(data);

    const url = 'https://us6.api.mailchimp.com/3.0/lists/5a16fe3458'
    const options = {
        method: "POST",
        auth: "vuvo1:fcfc8ba32b4d6991cb5b82cf0cc0a76c-us6"
    }

    const request = https.request(url, options, function(response) {
        var code = response.statusCode;
        if (code === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();

});

app.post('/failure', function(req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on port 3000...');
});


// MailChimp API Key
// fcfc8ba32b4d6991cb5b82cf0cc0a76c-us6

// MailChimp List Id
// 5a16fe3458