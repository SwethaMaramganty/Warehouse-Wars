--- load with 
--- sqlite3 database.db < schema.sql

DROP TABLE appuser;
DROP TABLE userScores; 

CREATE TABLE appuser (
	userID VARCHAR(20) PRIMARY KEY,
	name VARCHAR(20),
	email VARCHAR(30),
	password VARCHAR(20)
);


CREATE TABLE userScores(
	scoreID INTEGER PRIMARY KEY AUTOINCREMENT, 
	userID VARCHAR(20),
	score INTEGER, 
	FOREIGN KEY(userID) REFERENCES appuser(userID) ON DELETE CASCADE
);

---INSERT INTO appuser (userID, name, email, password) VALUES('swetha', 'swethaM', 'swe', 'hi');
---INSERT INTO userScores (userID, score) VALUES ('hi', 100);
---INSERT INTO userScores (userID, score) VALUES ('hi', 1);
---INSERT INTO userScores (userID, score) VALUES ('hi', 2);
---INSERT INTO userScores (userID, score) VALUES ('hi', 3);