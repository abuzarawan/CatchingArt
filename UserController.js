var dbase = require("./userDao");

function UserController() {

	that = this;
	that.checkLogin = function(emailId,password,callback) {
   console.log("checkin");
		dbase.checkLogin(emailId,password,function(user){
				//	res.send(200, users);
				//console.log("checking email"+user.emailId)
				callback(user);

		});		
	};
that.checkId = function(id,callback) {
   console.log("check id");
   console.log("id"+ id);
		dbase.checkId(id,function(user){
				//	res.send(200, users);
			//	console.log("checking email"+user.emailId)
				callback(user);

		});		
	};


	// Get the list of all users
	that.get = function(req, res, next) {
		dbase.retrieveUsers(function(users) {
			res.send(200, users);
		});		
		return next();
	};
	
	// Get single user
	that.getById = function(req, res, next) {
		console.log("in getby Id");
		user = dbase.retrieveUser(req.params.id, function(user) {
			if(user != null) {
				res.send(200, user);
			} else {
				res.send(404, "user not found");
			}
		});
		
		return next();
	};

	// Get List of users by name 
	that.getByName = function(req, res, next) {
		console.log("in getbyName name");
		user = dbase.retrieveUsersByName(req.params.name, function(user) {
			if(user != null) {
				user.forEach(function (item) {
				console.log(item.emailId);
				});
				res.send(200, user);
			} else {
				res.send(404, "user not found");
			}
		});
		
		return next();
	};

	// Create a new user
	that.post = function(req, res, next) {

		console.log(req.body);
		if(!req.body.hasOwnProperty('firstName','lastName','emailId','password','url')) {
			res.send(500, "Insufficient parameters, firstName required!"); 	// Internal Server Error
		} else {
			var user = {
				firstName : req.body.firstName,
				lastName : req.body.lastName,
				emailId : req.body.emailId,
				password: req.body.password,
				url:req.body.url
			};			

			dbase.saveUser(user, function(user){
				console.log('user added: _id '+user._id+' firstName:'+user.firstName+' lastName:'+user.lastName+' emailId'+user.emailId+' password'+user.password);
				res.send(201, user);	// Send "Created" code and the user object			
			});		
		}
		return next();
	};
	
	// Update a user
	that.put = function(req, res, next) {
		console.log("in put "+req.params.firstName +" "+req.params.lastName+"password"+req.params.password);
		user = {
			"_id" : req.body.id,
			"firstName": req.body.firstName,
			"lastName": req.body.lastName,
			"emailId" : req.body.emailId,
			"password": req.body.password,
			"url":req.body.url
		
		}
		
		dbase.updateUser(user, function(user) {			
			if(!user) {
				res.send(404, "user not found.");
			}
			console.log("Updated user "+req.params.id);
			res.send(200, user);	// 200 ok
		});		

		
		return next();
	};
	
	// Delete a user
	that.del = function(req, res, next) {
		dbase.deleteUser(req.params.id, function(result) {
			if(!result) {
				res.send(404, "user not found.");
			} 
			else {
				console.log("Deleted user "+req.params.id);
				res.send(200, "Deleted");	// 200 ok
			}
		});		

		return next();
	};
};

module.exports = new UserController();