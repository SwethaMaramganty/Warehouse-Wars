require('./port');
var express = require('express');
var app = express();

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
const sqlite3 = require('sqlite3').verbose();

// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
// will create the db if it does not exist
var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');

});

// db.serialize(function(){
// 	db.run("CREATE TABLE points (id VARCHAR(20) PRIMARY KEY, point INT);");

// 	var statement = db.prepare("INSERT INTO points (id, point) VALUES(?, ?);");
// 	statement.run('swetha', 20);
// 	statement.finalize();

// 	db.each("SELECT * FROM points", function(err, row){
// 		console.log(row.id, row.point);
// 	});
// });


//Check if it is a valid login




// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content')); 

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

app.post("/api/ww/profile/update/", function(req, res){

	var userName = req.body.userName; 
	var oldPassword = req.body.oldPassword;
	var newPassword = req.body.newPassword;

	let sql = 'SELECT * FROM appuser WHERE userID=? AND password=?;';
	db.get(sql, [userName, oldPassword], (err, row)=>{
		var result = {};
		if(err){
			res.status(404);
			result["error"] = err.message;
		}else if (row != null){
			let sql1 = 'UPDATE appuser SET password=? WHERE userID=?;';
			db.run(sql1, [newPassword, userName], function(err){
				var result = {};
				if(err){
					res.status(404);
					result["error"] = err.message;
				}else{
					res.status(200);
				}
			});
		}else{
			res.status(404);
			result["error"] = "Invalid credentials";
		}

		res.json(result);
	});

});

app.get("/api/ww/leaderboard/", function(req, res){

	let sql = 'SELECT * FROM userScores GROUP BY userID;';
	//console.log("hello my name is swetha");
	db.all(sql, [], (err, row) => {
		var result = {};
		if(err){
			//console.log("HERE");
			result["error"] = err.message;
			res.status(404);
		}else if(row != null){
			var scores = [];
			//console.log("OH YES");
			row.forEach((r)=>{
				//console.log(r.userID);
				scores.push({"userID" : r["userID"], "score": r["score"]});
			});

			result["scores"] = scores;
			res.status(200);
		}
		res.json(result);
	});
});

app.put("/api/ww/updateScore/", function(req, res){

	var userName = req.body.userName;
	var score = req.body.score
	//console.log(userName);
	let sql = 'INSERT INTO userScores (userID, score) VALUES (?, ?);';

	db.run(sql, [userName, score], (err, row)=>{
		var result = {};
		if(err){
			result["error"] = err.message;
			res.status(404);
		}else{
			res.status(200);
		}
		res.json(result);
	});
});

app.post("/api/ww/scores/", function(req, res){
	var userName = req.body.user;
	//console.log(userName);
	let sql = 'SELECT * FROM userScores WHERE userID=?;';

	// let sql1 = 'SELECT * FROM userScores;';
	// db.all(sql1, [], (err, rows) =>{
	// 	rows.forEach((r) =>{
	// 		console.log(r.userID, r.score);
	// 	});
	// });
	db.all(sql, [userName], (err, row)=>{
		var result = {};
		if(err){
			result["error"] = err.message;
		}else if(row != null){
			var scores = [];
			//console.log(row);
			row.forEach((r)=>{
				//console.log(r.userID);
				scores.push({"userID" : r["userID"], "score": r["score"]});
			});
			res.status(200);
			result["scores"] = scores;
		}else{
			//console.log("OMG");
		}

		res.json(result);
	});
});

app.post("/api/ww/login/", function (req, res) {

	var user = req.body.user;
	var password = req.body.password;


	let sql = 'SELECT * FROM appuser WHERE password=? AND userID=?;';
	db.get(sql, [password, user], (err, row) =>{
		var result = {};
		if(err){
			res.status(409);
			//console.log("HELLO");
			result["error"] = err.message;
		}else if (row==null){
			res.status(409)
			result["error"] = "Invalid authentication.";
		}else{
			res.status(200)
		}
		
		res.json(result);
	});
});

app.put("/api/ww/profile/delete/", function(req, res){
	var userName = req.body.userName;
	var password = req.body.password;
	let sql = 'DELETE FROM appuser WHERE userID=? AND password=?;';

	db.run(sql, [userName, password], function(err){
		var result={};
		if(err){
			res.status(404);
			result["errors"] = err.message;
		}else{
			res.status(200);
		}

		res.json(result);
	});

});

app.post("/api/ww/register/", function(req, res){

	var regName = req.body.name; 
	var regUserName = req.body.userName;
	//console.log(regUserName);
	var email = req.body.email;
	var regPassword = req.body.regPassword;

	let sql1 = 'SELECT * FROM appuser WHERE userID=?;';
	db.get(sql1, [regUserName], (err, row) =>{
		var result={};
		if(err){
			result["error"] = err.message;
		}else if(row==null){
			//alert("Username already exists. Pick another");

			let sql = 'INSERT INTO appuser (userID, name, email, password) VALUES (?, ?, ?, ?);';
			db.run(sql, [regUserName, regName, email, regPassword], function(err){
				if(err){
					res.status(409);
					result["error"] = err.message;
				}else{
					//console.log("REGISTERING USER: "+ regName);
					res.status(200);
				}
			});

		}else{
			res.status(409);
			//result["error"] = ("User already exists. Pick another");
			//console.log("User already exists");
		}

		res.json(result);
	});

});

//db.close();

