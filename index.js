#!/bin/node

//#!/usr/bin/env node



const http = require('http');
const { MongoClient } = require('mongodb');
const fs = require('fs')
const qs = require('querystring');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'abascal';

let db;
let collection;

async function db_connect() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);
  //const collection = db.collection('documents');

  return 'Conectados a la base de datos MongoDB.';
}

db_connect()
  .then(info => console.log(info))
  .catch(msg => console.error(msg));




function characters (response)
{

	let collection = db.collection('Characters');

	collection.find({}).toArray().then(characters => {
		let names = [];
		
		for (let i = 0; i < characters.length; i++){
			names.push(characters[i].name);
		}

		response.write(JSON.stringify(names));
		response.end();

	});
}

function character_items (response, url)
{
	let name = url[2].trim();
	if (name == ""){
		response.write("ERROR: Wrong URL");
		response.end();

		return;
	}

	let collection = db.collection('characters');
	collection.find({"name":name}).toArray().then(character => {
		if (character.length != 1){
			response.write("ERROR: Character "+name+" not exists");
			response.end();

			return;
		}

		let id = character[0].id_character;

		let collection = db.collection('characters_items');
		collection.find({"id_Characters":id}).toArray().then(ids => {
			if (ids.length == 0){
				
				response.weite("[]");
				response.end();

				return;
			}
		
			let ids_items = [];

			ids.forEach(element => {
				ids_items.push(element.id_item);
			});

			let collection = db.collection('items');
			collection.find({"id_item": {$in:ids_items} }).toArray().then(items => {
				response.write(JSON.stringify(items));
				response.end();

				return;
			});

		});
	});
}

function items (response, url)
{

	if (url.length >= 3){
		character_items (response, url);

		return;
	}

	let collection = db.collection('items');

	collection.find({}).toArray().then(items => {
		let names = [];
		
		for (let i = 0; i < items.length; i++){
			names.push(items[i].item);
		}

		response.write(JSON.stringify(names));
		response.end();

	});
}

function weapons (response)
{

	let collection = db.collection('weapons');

	collection.find({}).toArray().then(weapons => {
		let names = [];
		
		for (let i = 0; i < weapons.length; i++){
			names.push(weapons[i].weapon);
		}

		response.write(JSON.stringify(names));
		response.end();

	});
}

function age (response, url)
{

if (url.length < 3){

	response.write("ERROR: Introduce a Character");
	response.end();
	return;
  
}
	let collection = db.collection('Characters');
	console.log(url);

	collection.find({"name":url[2]}).project({_id:0,age:1}).toArray().then(character => {
		console.log(character);
		  if (character.length == 0){
			response.write("ERROR: Wrong Age");
			response.end();
			return;
		}	

		response.write(JSON.stringify(character[0]));
		response.end();

	});
}

function character_info(response, id_character)
{
	let collection = db.collection('Characters');

	collection.find({"id_Characters":Number(id_character)}).toArray().then(character => {

		response.write(JSON.stringify(character));
		response.end();
	});
}

function insert_character(request, response)
{
	if (request.method != "POST"){
		response.write("ERROR: Form not sent");
		response.end();

		return;
	}
	
	let data = "";
	request.on('data', function(character_chunk){
		data += character_chunk;
	});

	request.on('end', function(){
		console.log(data);
		
		let info = qs.parse(data);

		console.log(info);
		
		let collection = db.collection("Characters");

		if (info.name == undefined){
			response.write("ERROR: Name not define");
			response.end();
			return;
		}
		if (info.age == undefined){
			response.write("ERROR: Age not define");
			response.end();
			return;
		}
		
		let insert_info = {
			name: info.name,
			age: parseInt(info.age)
		};

		collection.insertOne(insert_info);

		response.write("New Character "+insert_info.name+" insert");

		response.end();
	});
}

let http_server =  http.createServer(function(request, response){
	if (request.url == "/favicon.ico"){
		return;
	}
    
	let url = request.url.split("/");
	let value = request.url.split("?");

	switch (url[1]){
		case "characters":
			characters(response);
			break;
		case "items":
			items(response, url);
			break;
		case "weapons":
			weapons(response);
			break;
		case "age":
			age(response, url);
			break;

		case "character_form":
			insert_character(request, response);
			
			break;

	default:

		if(value[1])
		{
			let values = value[1].split("=");
			let id_character = values[1];

			character_info(response, id_character);
			
			return;
		}

		fs.readFile("index.html", function (err, data){
			if(err){
				console.error(err);
				response.writeHead(404, {'Content-Type':'text/html'});
				response.write("ERROR 404: Recharge the page");
				response.end();

				return;
			}
			
			response.writeHead(200, {'Content-Type':'text/html'});
			response.write(data);
			response.end();

		});

	}
	
}).listen(7070);																																																																																																																																																																																																																																																																																								
