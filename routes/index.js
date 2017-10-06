var express = require('express');
var router = express.Router();
var SampleWebFunction = require('../SampleWebFunction.js');
var RestClient = require('node-rest-client').Client;


/* GET home page. */
router.get('/', function(req, res, next) {

	var state = SampleWebFunction.getUniqueStr();
	req.session.state = state;
	res.render('index', { state: state });
});

router.get('/callback',function(req, res, next) {

	var state = req.query.state;
	var code = req.query.code;
	var session_state = req.session.state;
	/*
	console.log("STATE:" + state);
	console.log("CODE:"  + code);
	console.log("SESSION_STATE:" + session_state);
	*/
	if ( state != session_state){
		console.log("state parameter is unvalid");
		var state = SampleWebFunction.getUniqueStr();
		req.session.state = state;
		res.redirect('/');
	}

	var accessTokenClient = new RestClient();

	var accessTokenClientArgs = {
		headers : {
        		"Content-Type" : "application/x-www-form-urlencoded"
                },
                data: {
                        grant_type : "authorization_code",
                        code : code,
                        client_id : "1512763897",
                        client_secret : "db10238418867377c7269b3d4b2bc9a6",
                        redirect_uri : "https://test.kirimanjirou.com:2017/callback"
                }
	};
		
	accessTokenClient.post("https://api.line.me/v2/oauth/accessToken", accessTokenClientArgs, function (data, response) {
		if( data.error ){
        	        console.log("accessTokenClient is failed: ");
			console.log(data);
			res.redirect('/');
		}
		var bearer =  "'Bearer " + data.access_token + "'";

		//console.log("ACCESS_TOKEN:" + data.access_token);
		var userInfoClientArgs = {
                        headers : {
                                'Authorization' : bearer
                        }
		};
		var userInfoClient = new RestClient();
		userInfoClient.get("https://api.line.me/v2/profile", userInfoClientArgs, function (data, response) {
			if( data.error ){
				console.log("userInfoClient is failed: ");
				console.log(data);
				res.redirect('/');
			}
			console.log(data);
			res.render('users', {
				displayName: data.displayName,
				pictureUrl: data.pictureUrl,
				statusMessage: data.statusMessage,
				openId : data.userId,
				state: state
			});	
		});
	});	
});

module.exports = router;
