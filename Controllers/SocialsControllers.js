let express = require('express')

let app = express.Router();

let bodyParser = require('body-parser');

let urlEncoded = bodyParser.urlencoded({ extended: false});

const unirest = require('unirest');
const CreatorProfileModel = require('../Models/CreatorsProfileModel');

app.get('/login_instagram/:user_id/:code', urlEncoded, (req, res)=>{
    unirest('POST', `https://api.instagram.com/oauth/access_token`)
    .headers({
        'Accept': 'application/json'
    })
    .send({
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.INSTAGRAM_APP_REDIRECT_URI,
        code: req.params.code
    })
    .then(response =>
        {
            let data = JSON.parse(response.raw_body);

            // Get User Details
            unirest('GET', `https://graph.instagram.com/${data.user_id}?fields=id,username&access_token=${data.access_token}`)
            .then(newResponse => {

                let result = JSON.parse(newResponse.raw_body);

                CreatorProfileModel.findOneAndUpdate({_id: req.params.user_id}, { instagramUserId: result.id, instagramUserName: result.username}, { new: true})
                .then(()=>{
                    res.json("success");
                })
                .catch( err => {
                    res.json("error");
                })

            })
            .catch(err => {
                res.json("error")
            })
        }
    )
    .catch(err => {
        res.json("error")
        console.log(err.body)
    }
        
    )
})

app.get('/instagram_status/:user_id', urlEncoded, (req, res)=>{
    CreatorProfileModel.findOne({ _id: req.params.user_id})
    .then(data => 
        {
            if(Number(data.instagramUserId) > 0){
                res.json('success')
            }else{
                res.json('failed');
            }
        })
})

module.exports = app;