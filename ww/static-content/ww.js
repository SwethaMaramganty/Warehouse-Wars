
function getRandomInt(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}


class Actor{
	constructor(stage, x, y){
		this.stage = stage;
		this.x = x;
		this.y = y;
	}

	move(x, y){};

}

class Box extends Actor{}

class Wall extends Actor{}

class Monster extends Actor{

	checkTrapped(){
		for(var i=-1; i<=1;i++){
			for(var j=-1;j<=1;j++){
				var check = this.stage.getActor(this.x+i, this.y+j);
				if(!(check instanceof Box) && !(check instanceof Wall) && !(check instanceof Monster)){
					return false;
				}
			}
		}
		return true;
	}
	
	move(x,y){
		
		if(!this.checkTrapped()){
			var versus = this.stage.getActor(this.x+x,this.y+y);		
			if(versus==null){
				this.stage.setImage(this.x+x,this.y+y,'icons/face-devil-grin-24.png');
				this.stage.setImage(this.x, this.y, 'icons/blank.gif');
				this.x+=x;
				this.y+=y;
			}
			else if(versus instanceof Player){
				this.stage.removeActor(this.player);
				this.stage.player.alive = false;
				this.stage.setImage(this.x+x,this.y+y,'icons/face-devil-grin-24.png');
				this.stage.setImage(this.x, this.y, 'icons/blank.gif');
				updateScore(this.stage.score);
				if(confirm('You died! Restart game?')){
					clearInterval(this.stage.myinv);
					clearInterval(this.stage.myinv2);
					setupGame();
					startGame();
				}
				else{
					clearInterval(this.stage.myinv);
					clearInterval(this.stage.myinv2);
					this.stage.paused=true;
				}
			}
		}
		else{
			this.stage.setImage(this.x,this.y, 'icons/blank.gif');
			this.stage.removeActor(this);
			this.stage.monsters-=1;
			this.stage.score +=this.stage.timer;
			this.stage.setScore(this.stage.score);
			this.stage.setMonsterCount(this.stage.monsters);
			
			if(this.stage.monsters==0){
				clearInterval(this.stage.myinv);
				clearInterval(this.stage.myinv2);
				this.stage.paused=true;

				//Put it in db, the username and this.stage.score
				updateScore(this.stage.score);
				alert('YOU WON!!');
			}
		}
	}
}
function shuffle(moves){
	for(var i=moves.length-1; i>0; i--){
		var j = Math.floor(Math.random() * (i+1));
		[moves[i], moves[j]] = [moves[j],  moves[i]];
	}
}


class SuperMonster extends Monster{

	move(){

		if(!this.stage.paused){
			if(!this.checkTrapped()){
				var moves = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
				shuffle(moves);
				for(var i=0;i<moves.length;i++){
					//console.log(moves[i]);
					var x = moves[i][0];
					var y = moves[i][1];
					var versus = this.stage.getActor(this.x+x,this.y+y);		
					if(versus==null){
						this.stage.setImage(this.x+x,this.y+y,'icons/badMonster.png');
						this.stage.setImage(this.x, this.y, 'icons/blank.gif');
						this.x+=x;
						this.y+=y;
						return;
					}
					else if(versus instanceof Player){
						this.stage.removeActor(this.player);
						this.stage.player.alive = false;
						this.stage.setImage(this.x+x,this.y+y,'icons/badMonster.png');
						this.stage.setImage(this.x, this.y, 'icons/blank.gif');
						updateScore(this.stage.score);
						if(confirm('You died! Restart game?')){
							clearInterval(this.stage.myinv);
							clearInterval(this.stage.myinv2);
							setupGame();
							startGame();
						}
						else{
							clearInterval(this.stage.myinv);
							clearInterval(this.stage.myinv2);
							this.stage.paused=true;
						}
						return;
					}
				}
			}
			else{
				this.stage.setImage(this.x,this.y, 'icons/blank.gif');
				this.stage.removeActor(this);
				this.stage.monsters-=1;
				this.stage.score +=this.stage.timer;
				this.stage.setScore(this.stage.score);
				this.stage.setMonsterCount(this.stage.monsters);
				
				if(this.stage.monsters==0){
					clearInterval(this.stage.myinv);
					clearInterval(this.stage.myinv2);
					this.stage.paused=true;

					//Put it in db, the username and this.stage.score
					updateScore(this.stage.score);
					alert('YOU WON!!');
				}
			}
		}
	
	}
}


class Player extends Actor{
	
	super(stage, x, y){
		this.stage = stage;
		this.x = x;
		this.y = y;
		this.alive = true;
	}

	move(x,y){
		if(!this.stage.paused){
			var versus = this.stage.getActor(this.x+x,this.y+y);
			if(versus==null){
				this.stage.setImage(this.x+x,this.y+y,'icons/face-cool-24.png');
				this.stage.setImage(this.x,this.y,'icons/blank.gif');
				this.x+=x;
				this.y+=y;
			}
			else if(versus instanceof Monster){
				this.stage.removeActor(this);
				this.stage.player.alive = false;
				this.stage.setImage(this.x, this.y, 'icons/blank.gif');
				updateScore(this.stage.score);
				if(confirm('You died! Restart game?')){
					clearInterval(this.stage.myinv);
					clearInterval(this.stage.myinv2);
					setupGame();
					startGame();
				}
				else{
					clearInterval(this.stage.myinv);
					clearInterval(this.stage.myinv2);
					this.stage.paused=true;

				}
			}
			else if(versus instanceof Box){
				let xLastBox = this.x+x;
				let yLastBox = this.y+y;
				while(this.stage.getActor(xLastBox+x, yLastBox+y)!= null && this.stage.getActor(xLastBox+x, yLastBox+y) instanceof Box){
					
					xLastBox+=x;
					yLastBox+=y;
				}
				if(this.stage.getActor(xLastBox+x, yLastBox+y)==null){
					this.stage.getActor(this.x+x,this.y+y).x=xLastBox+x;
					this.stage.getActor(xLastBox+x,this.y+y).y= yLastBox+y;
					this.stage.setImage(xLastBox+x, yLastBox+y,'icons/emblem-package-2-24.png');
					this.stage.setImage(this.x,this.y,'icons/blank.gif');
					
					this.stage.setImage(this.x+x,this.y+y,'icons/face-cool-24.png');
					this.x+=x;
					this.y+=y;
				}
			}
		}
	}
}

// Stage
// Note: Yet another way to declare a class, using .prototype.


function Stage(width, height, stageElementID){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player
	this.myinv=null;
	this.myinv2=null;
	// the logical width and height of the stage
	this.width=width;
	this.height=height;
	this.score=0;
	this.monsters=0;
	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;

	this.paused = false;
	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;

}
// initialize an instance of the game
Stage.prototype.initialize=function(){
	// Create a table of blank images, give each image an ID so we can reference it later
	this.setScore(this.score);

	var s='<table>';
	// YOUR CODE GOES HERE
	for(var i=0;i<this.width;i++){
		s+="<tr>";

		for(var j=0;j<this.height;j++){
			s+="<td>";
			// Add walls around the outside of the stage, so actors can't leave the stage
			if(j==0 || i==0 || i==this.width-1 || j==this.height-1){
				s+="<img id='("+i+","+j+")' src='icons/wall.jpeg'/>";
				wall = new Wall(this);
				wall.x = i;
				wall.y = j;
				this.addActor(wall);
			}
			// Add the player to the center of the stage
			else if(i==this.width/2 && j==this.height/2){
				s+="<img id='("+i+","+j+")' src='icons/face-cool-24.png'/>";
				player = new Player(this,i,j);
				this.player = player;
				this.addActor(this.player);
			}

			else{
				s+="<img id='("+i+","+j+")'src='icons/blank.gif'/>";
			}

			s+="</td>";
		}

		s+="</tr>"
	}
	s+="</table>";
	// Put it in the stageElementID (innerHTML)
	document.getElementById('stage').innerHTML = s;
	// Add some Boxes to the stage
	for(var i=0; i<(this.width*this.height/(3.5)); i++){
		box = new Box(this);
		x = getRandomInt(1, this.width-1);
		y = getRandomInt(1, this.height-1);
		
		while(!document.getElementById('('+x+','+y+')').src.includes('icons/blank.gif')){
			x = getRandomInt(1, this.width-1);
			y = getRandomInt(1, this.height-1);
		}

		box.x = x;
		box.y = y;
		this.addActor(box);
		this.setImage(x,y,'icons/emblem-package-2-24.png');
		

	}

	// Add in some Monsters
	 for(var i=0; i< (this.height*this.width)/40; i++){
	 	monster = new Monster(this);
	 	x = getRandomInt(1, this.width-1);
	 	y = getRandomInt(1, this.height-1);
		
	 	while(!document.getElementById('('+x+','+y+')').src.includes('icons/blank.gif')){
	 		x = getRandomInt(1, this.width-1);
	 		y = getRandomInt(1, this.height-1);
	 	}
	 	monster.x = x;
	 	monster.y = y;
	 	this.addActor(monster);
	 	this.monsters+=1;
	 	this.setImage(x,y,'icons/face-devil-grin-24.png');

	}

	sMonster = new SuperMonster(this);
	x = getRandomInt(1, this.width-1);
	y = getRandomInt(1, this.height-1);
	
	while(!document.getElementById('('+x+','+y+')').src.includes('icons/blank.gif')){
		x = getRandomInt(1, this.width-1);
		y = getRandomInt(1, this.height-1);
	}
	sMonster.x = x;
	sMonster.y = y;
	this.addActor(sMonster);
	this.monsters+=1;
	this.setImage(x,y,'icons/badMonster.png');

	this.setMonsterCount(this.monsters);

}

Stage.prototype.moveMonsters = function(){
	for(var i=0;i<this.actors.length; i++){
		if(this.actors[i] instanceof SuperMonster){
			this.actors[i].move();
			continue;
		}
		if(this.actors[i] instanceof Monster){
			x = getRandomInt(-1,1);
			y = getRandomInt(-1,1);
			this.actors[i].move(x,y);
		}
	}
}

// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){ return ""; }

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).
	this.actors.splice(this.actors.indexOf(actor),1)
	//console.log(this.actors);
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
	document.getElementById('('+x+','+y+')').src = src;
}

Stage.prototype.setScore=function(s){
	document.getElementById('score').innerHTML = 'Score: ' + s;
}

Stage.prototype.setMonsterCount=function(c){
	document.getElementById('monsterCount').innerHTML = 'Monsters: ' + c;
}

// Take one step in the animation of the game.  
Stage.prototype.step=function(){
	for(var i=0;i<this.actors.length;i++){
		// each actor takes a single step in the game
	}
}

// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
	
	for(var i=0; i<this.actors.length;i++){
		if(this.actors[i].x == x && this.actors[i].y == y){
			return this.actors[i];
		}
	}
	return null;
}
// End Class Stage

// Stage.prototype.updateScore=function(){
// 	var score = this.player.getScore();
// 	document.getElementById('score').innerHTML = "Score: " + score;

// }
function game(){
	$("#main").hide();
	$("#beforeGameLegend").hide();
	$("#register").hide();
	$("#login").hide();
	$("#game").show();
	$("#navBar").show();
	$("#leaderboard").hide();
	$("#myScoresTable").hide();

}

function mainlogin(){
	$("#main").hide();
	$("#navBar").hide();
	$("#beforeGameLegend").hide();
	$("#register").hide();
	$("#game").hide();
	$("#login").show();
	$("#profile").hide();
	$("#leaderboard").hide();
	$("#myScoresTable").hide();
}

function mainRegister(){
	$("#main").hide();
	$("#navBar").hide();
	$("#beforeGameLegend").hide();
	$("#game").hide();
	$("#login").hide();
	$("#register").show();
	$("#profile").hide();
	$("#myScoresTable").hide();
	$("#leaderboard").hide();
}


function playGame(){
	$("#game").show();
	$("#navBar").show();
	$("#beforeGameLegend").hide();
	$("#gameDescription").hide();
	$("#profile").hide();
	$("#leaderboard").hide();
	$("#myScoresTable").hide();
	setupGame();
	startGame();
}


function showProfile(){
	$("#navBar").show();
	$("#profile").show();
	$("#beforeGameLegend").hide();
	$("#register").hide();
	$("#game").hide();
	$("#login").hide();
	pauseGame();
	$("#leaderboard").hide();
	$("#myScoresTable").hide();
	$("#updatePassword").on('click', function(){updatePassword(); });
	$("#deleteAccount").on('click', function(){deleteAccount(); });
}


function logout(){
	location.reload();
}


function deleteAccount(){
	console.log("Tryna delete");

	var userName = $("#delUserName").val();
	var password = $("#delPassword").val();
	if(userName != "" && password != ""){
		$.ajax({
			method: "PUT",
			url: "/api/ww/profile/delete/",
			data: {"userName" : userName, "password": password}
		}).done(function(data){
			if("error" in data){
				alert(data["error"]);
				showProfile();
			}else{
				location.reload();
			}
		}).fail(function(err){
			alert("Invalid authentication.");
			showProfile();
		});
	}else{
		alert("Invalid credentials");
		showProfile();
	}
}

function updateScore(score){
	var userName = $("#userName").val();
	if(userName != null){
		$.ajax({ 
			method: "PUT",
			url : "api/ww/updateScore/",
			data: {"userName" : userName, "score": score}
		}).done(function(data){
			if("error" in data){
				alert(data["error"]);
			}
		}).fail(function(err){

		});
	}
}

function updatePassword(){

	var userName = $("#updateUserName").val();
	var oldPassword = $("#oldPassword").val();
	var newPassword = $("#newPassword").val();

	//console.log(userName);
	if(userName != "" && oldPassword != "" && newPassword != ""){
		if(oldPassword != newPassword){
			$.ajax({
				method: "POST", 
				url: "/api/ww/profile/update/",
				data: {"userName" : userName, "oldPassword": oldPassword, "newPassword" : newPassword}
			}).done(function(data){
				if("error" in data){
					alert(data["error"]);
					showProfile();
				}else{
					mainlogin();
				}
			}).fail(function(err){
				alert("Invalid authentication.");
				showProfile();
			});
			
		}else{
			alert("Your old password matches new password. Select another one.")
		}
	}else{
		alert("Invalid credentials");
	}

}

function Leaderboard(){

	pauseGame();
	$("#navBar").show();
	$("#profile").hide();
	$("#beforeGameLegend").hide();
	$("#register").hide();
	$("#game").hide();
	$("#login").hide();
	$("#leaderboard").show();
	$("#myScoresTable").hide();
	showLeaderboard();
}

function showLeaderboard(){
	$.ajax({
		method: "GET",
		url: "/api/ww/leaderboard/"
	}).done(function(data){
		if("error" in data){
			alert(data["error"]);
		}else{
			var allLeaderboardScores =data["scores"];
			//console.log(allScores);
			var allLeaderboardScoresHTML = "<table><tr><td>Leaderboard</td></tr>";

			for(var i=0; i<allLeaderboardScores.length; i++){
				allLeaderboardScoresHTML = allLeaderboardScoresHTML + "<tr><td>" +allLeaderboardScores[i]["userID"] + "         " + allLeaderboardScores[i]["score"] + "</td></tr>";
			}
			allLeaderboardScoresHTML = allLeaderboardScoresHTML + "</table>";
			$("#leaderboard").html(allLeaderboardScoresHTML);
		}
	});
}


function showScores(){

	var name = $("#userName").val();
	pauseGame();
	$("#game").hide();
	$("#leaderboard").hide();
	$("#profile").hide();
	$("#myScoresTable").show();
	//console.log(name);

	if(name != ""){
		$.ajax({
			method: "POST",
			url: "/api/ww/scores/",
			data: {"user": name}
		}).done(function(data){
			if("error" in data){
				alert(data["error"]);
			}else{
				//console.log(JSON.stringify(data));
				var allScores=data["scores"];
				//console.log(allScores);
				var allScoresHTML = "<table><tr><td>My Scores</td></tr>";

				for(var i=0; i<allScores.length; i++){
					allScoresHTML = allScoresHTML + "<tr><td>" +allScores[i]["score"] + "</td></tr>";
				}
				allScoresHTML = allScoresHTML + "</table>";
				$("#myScoresTable").html(allScoresHTML);
			}
		}).fail(function(err){
			alert(err);
		});
	}
}

function register(){

	var nameText = $("#name").val();
	var userText = $("#regUserName").val();
	var email = $("#email").val();
	var regPassword = $("#regPassword").val();
	var regRePassword = $("#regRePassword").val();

	//console.log("Registering here...");
	if(nameText != "" && userText != "" && email != "" && regPassword != "" && regRePassword != ""){
		if(regPassword==regRePassword){
			mainlogin();

			$.ajax({
				method: "POST",
				url: "/api/ww/register/",
				data: {"name": nameText, "userName": userText, "email": email, "regPassword": regPassword}
			}).done(function(data){
				if("error" in data){
					alert(data["error"]);
					mainRegister();
				}else{
					$("#login").show();
				}
			}).fail(function(err){
				alert("Invalid authentication.");
				mainRegister();
			});

		}else{
			alert("Passwords do not match. Please enter again");
			mainRegister();
		}
	}else{
		alert("Invalid credentials");
		mainRegister();
	}
}


function login(){

	var userText = $("#userName").val();
	var passwordText = $("#userPassword").val();

	if(userText != "" && passwordText != ""){

		$.ajax({
			method: "POST",
			url: "/api/ww/login/",
			data: {"user": userText, "password": passwordText}
		}).done(function(data){

			if("error" in data){
				$("login").show();
				alert(data["error"]);
			}else{
				//console.log(userText);
				$("#beforeGameLegend").show();
				$("#login").hide();
				$("#main").hide();
				$("#register").hide();
				$("#game").hide();
				$("#navBar").hide();

			}
		}).fail(function(err){
			alert("Invalid authentication.");
		});
	}else{
		alert("Invalid credentials");
	}
}


