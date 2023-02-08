#!/bin/node

const http = require('http');
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'abascal';
let db;
let collection;

async function dbConnect() {
await client.connect();
	console.log('Connected successfully to server');
		db = client.db(dbName);
return 'Connected to MongoDB database';
}

dbConnect()
.then(console.log)
.catch(console.error);

function send_characters (response)
{

	collection = db.collection('Characters');

	collection.find({}).toArray().then(characters => {

	let names = [];
							
	for (let i = 0; i < characters.length; i++){
										
	names.push(characters[i].name);
}

if (request.url == "Characters"){
																
	names.push(characters[i].name);
}
	response.write(JSON.stringify(names));
																											
	response.end();
	});
}




function send_age(response,url)
{
	if (url.length < 3)
	{
		response.write("Edad Erronea");
		response.end();
		return;


	}

let collection = db.collection('Characters');
console.log(url);

collection.find({"name":url[2]}).toArray().then(character => {

console.log(character);

let data = {
		age: character[0].age
};

		response.write(JSON.stringify(data));
	response.end();
});
}


let http_server = http.createServer(function(request, response) {

console.log("Alguien se conecta");

if (request.url == "/favicon.ico") {
return;
	}

let url = request.url.split("/");

switch (url[1])
{
case "Characters":
	send_characters(response);
	break;
		case "age":
			send_age(response,url);
			break;

		default:
		response.write("Página principal");
		response.end();
		}
});
http_server.listen(6969)
