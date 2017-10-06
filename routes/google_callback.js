var express = require('express');
var router = express.Router();
var SampleWebFunction = require('../SampleWebFunction.js');
var RestClient = require('node-rest-client').Client;


/* GET home page. */
router.get('/',function(req, res, next) {

	var state = req.query.state;
	var code = req.query.code;
	var session_state = req.session.state;

	console.log("STATE:" + state);
	console.log("CODE:"  + code);
	console.log("SESSION_STATE:" + session_state);
	
	if ( state != session_state){
		console.log("state parameter is unvalid");
		var state = SampleWebFunction.getUniqueStr();
		req.session.state = state;
		res.redirect('/');
	}else{

		var accessTokenClient = new RestClient();
	
		var accessTokenClientArgs = {
			headers : {
	        		"Content-Type" : "application/x-www-form-urlencoded",
	                },
	                data: {
	                        grant_type : "authorization_code",
	                        code : code,
	                        redirect_uri : "https://test.kirimanjirou.com:2017/google_callback",
				client_id : "1064415930677-vl8maa82c7mv45h3f774ag76rqmjkicq.apps.googleusercontent.com",
				client_secret : "kpSs4FRN7jguLlE98klo9Eie"
	                }
		};
			
		accessTokenClient.post("https://www.googleapis.com/oauth2/v4/token", accessTokenClientArgs, function (data, response) {
			if( data.error ){
	        	        console.log("accessTokenClient is failed: ");
				console.log(data);
				res.redirect('/');
			}else{
				var bearer =  "Bearer " + data.access_token;
				console.log("ACCESS_TOKEN:" + data.access_token);
				SampleWebFunction.verifyIdToken(data.id_token,  function (err, data){
					if(err){
						console.log("ID Token Verify is failed: ");
						console.log(data);
						res.redirect('/');
					}else{
						var userInfoClientArgs = {
							headers : {
								'Authorization' : bearer
							}
						};
						console.log(userInfoClientArgs);
						var userInfoClient = new RestClient();
						userInfoClient.get("https://www.googleapis.com/oauth2/v3/userinfo", userInfoClientArgs, function (data, response) {
							if( data.error ){
								console.log("userInfoClient is failed: ");
								console.log(data);
								res.redirect('/');
							}else{
								console.log(data);
								res.render('users', {
									displayName: data.name,
									pictureUrl: data.picture,
									statusMessage: "",
									openId : data.sub,
									state: state
								});
							}
						});
					}
				});
			}	
		});	
	}
});

module.exports = router;
