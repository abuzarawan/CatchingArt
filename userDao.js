var mongo  = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

function mongoCRUD() {
	
	that = this;
	var collection;
	
	mongo.connect("mongodb://localhost:27017/laware", function(err, db){
	if(err) {
			return console.dir(err); 
		}
		console.log("Connected to mongodb");
		
		collection = db.collection('users', function(err, collection) {
			if(err) {
				console.log("Error with collection:");
				console.log(err);
			}
		});
	});
	
	/**
	*	Loads the student list from the database collection
	*/
	that.retrieveUsers = function(callback) {
		console.log("Retrieving Users list...");
		collection.find().toArray(function(err, items) {
			callback(items);
		});
	}
	/**
	*	Loads the user list from by user anme or emailid  the database collection
	*/
	that.retrieveUsersByName = function(name,callback) {
		console.log("Retrieving Users by name list...");
		user = {	'emailId': new RegExp(name, 'i')
				};	
		user2={
		'firstName':new RegExp(name, 'i')
			};
		user3={
		'lastName':new RegExp(name, 'i')
		};
		
		collection.find(user||user2||user3).toArray(function(err, items) {
			callback(items);
		});
	}
	/**
	*returns user data if username and password is same 
	*/
	that.checkLogin = function(emailId,password,callback) {
		console.log("checking  Users credentials...");
		user = {	'emailId': emailId,
					'password':password 
			   };	
		
		collection.findOne(user,function(err, items) {
			//console.log("items"+items);
			callback(items);
		});
	}
	/**
	*returns user data if username and password is same 
	*/
	that.checkId = function(id,callback) {
		console.log("checking  if User exists...");
		console.log("id"+ id );
		user = {"_id":new ObjectId(id)};	
		
		collection.findOne(user,function(err, items) {
			//console.log("items"+items);
			callback(items);
		});
	}
	/**
	 * Retrieves a single user
	 */ 
	that.retrieveUser = function(id, callback) {		
		// create ObjectId as identification criterion
		user = {	'_id': new ObjectId(id) };	
		collection.findOne(user, function(err, items) {
			callback(items);
		});		
	}
	
	/**
	 * Saves a new user to the database. 
	 * Returns full user object including the id!
	 */
	that.saveUser = function(user, callback) {
		collection.insert(user, function(err, result){
			if(err) {
				Console.log("Error: "+err);
				callback(null);
			}
			else {
				callback(result['ops']);
			}
		});
	}
	
	/**
	 * Update name of existing user
	 */
	that.updateUser = function(user, callback) {
		collection.update({"_id":new ObjectId(user._id)}, 
					      {$set:{password:user.password,url:user.url}}, {w:1}, 
		function(err, result) {
			if(err) {
				console.log(err);
			}
		});
		callback(user);
	}
	
	/**
	 * Deleting users
	 */
	that.deleteUser = function(id, callback) {
		collection.remove({"_id":new ObjectId(id)}, function(err, result) {
			if(err) {
				console.log(err);
				callback(null);
			}
		});
		callback(true);
	}

}

module.exports = new mongoCRUD();
