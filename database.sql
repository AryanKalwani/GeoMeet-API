CREATE DATABASE geomeetdb;

CREATE TABLE users(
    username TEXT PRIMARY KEY,
    email VARCHAR (100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    online VARCHAR (20) NOT NULL,
    reqSent TEXT [],
    reqReceived TEXT [],
    location VARCHAR(300),
    friends TEXT []
);