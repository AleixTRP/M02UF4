#!/bin/node

const http = require('http');
const { MongoClient } = require('mongodb');
const fs = require('fs');

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


function send_Characters (response)
{

collection = db.collection('Characters');

collection.find({}).toArray().then(Characters => 
{

	let names = [];
											
for (let i = 0; i < Characters.length; i++)
	{
																								
																											names.push(Characters[i].name);
																											}
	
																												response.write(JSON.stringify(names));
																												response.end();
																													});
																												}


function send_items (response)
{

collection = db.collection('items');

collection.find({}).toArray().then(items => 
{

	let names = [];
											
for (let i = 0; i < items.length; i++)
	{
	names.push(items[i].item);
																											}
	
																												response.write(JSON.stringify(names));										response.end();																			});
																											}

function send_weapons (response)
{

collection = db.collection('weapons');

collection.find({}).toArray().then(weapons => 
{

	let names = [];
											
for (let i = 0; i < weapons.length; i++)
	{
	names.push(weapons[i].weapon);
																											}
	
																												response.write(JSON.stringify(names));										response.end();																			});
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

	collection.find({"name":url[2]}).project({_id:0,age:1})
	.toArray().then(Character => {

	console.log(Character);


		response.write(JSON.stringify(Character[0]));
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
			
			send_Characters(response);
				
				break;
		case "items":
			send_items(response);

				break;
		case "weapons":
			send_weapons(response);

				break;
		
		case "age":
			
			send_age(response,url);
			
			break;

		default:
		fs.readFile("index.html", function(err,data){
			if(err)
			{
				console.error(err);
				response.write(404,{'Content-Type':'text/html'});
				response.write("Error:404: El archivo no esta aqui");
				response.end();
				
				return;
				}
				response.writeHead(200,{'Content-Type':'text/html'});
				response.write(data);
				response.end();
			
			});
		}
});
	
	http_server.listen(6969)
