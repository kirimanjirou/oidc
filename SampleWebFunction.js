exports.getUniqueStr = function(myStrong){
  var strong = 1000;
  if (myStrong) strong = myStrong;
  return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
};

exports.verifyIdToken = function(input, callback){
	separateIdToken = input.split(".");
	console.log(separateIdToken[0]);
	console.log(separateIdToken[1]);
	console.log(separateIdToken[2]);

	var jwt = separateIdToken[0];
	var jwtDecode = new Buffer(jwt, 'base64').toString();
	var jwtJson = JSON.parse(jwtDecode);

	var id_token = separateIdToken[1];
	var id_tokenDecode =  new Buffer(id_token, 'base64').toString();
	var id_tokenJson = JSON.parse(id_tokenDecode);

	var signature = separateIdToken[2];

	console.log(jwtJson);
	console.log(id_tokenJson);
	console.log(signature);

	var data = id_tokenJson;
	var err;
	callback(err, data);
};
