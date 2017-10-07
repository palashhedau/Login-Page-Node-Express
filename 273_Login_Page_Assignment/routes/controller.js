var session = require('express-session');
var mysql = require ('mysql');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false }) ;
var url = require('url');   

module.exports = function(app){
	
	 var connection = mysql.createConnection({
		 host : 'localhost',
		 user : 'root',
		 password : 'root',
		 database : 'palash'
	 });
	 
	
	app.get('/users',function(req,res)
	{
		
		
		res.send('USERS PAGE');
				
	});
	
	app.get('/',function(req,res)
	{
		
		res.render('index');
		
	});
	
	
	app.get('/registration',function(req,res)
	{
		
		var errorMessage = req.query.errorMessage;
		 
		 var data = {
				 userExist : errorMessage
		 }
		 
		
		res.render('registration',{data : data});
				
	});
	
	
	
	app.post('/registrationSuccess',function(req,res)
	{
		var username = req.body.username ; 
		var password = req.body.password ; 
		var fname = req.body.fname ; 
		var lname = req.body.lname ; 
		var dob = req.body.dob ; 
		var gender = req.body.gender ; 
		
	
		var query = 'select * from users where username =\'' + username +  '\'' ; 
		
		
		connection.query(query , function(err , rows , fields){
			if(err ) throw err ;
			
			if(rows[0]){
				console.log("user present");
				//res.render('/registration?errorMessage=' + "Username taken, try with a different one");
				
				 res.redirect(url.format({
				       pathname:"/registration",
				       query: {
				    	   errorMessage : "Username taken, try with a different one"
				        }
				     }));
				
			}else{
				var userObject = [[username , password , fname , lname , dob , gender]];
				
				connection.query('insert into users (username,password, fname, lname ,dob , gender) VALUES ?',[userObject] ,
						function(err  , result){
					if(err) throw err;
					else{
						var name = {
								fname : fname,
								lname : lname
						}
						
						res.render('registrationSuccess',{data : name});
					}
					
					
				})
			}
			
			
		})
		
	});
	
	
	app.get('/login',function(req,res)
	{
		res.render('login');
								
	});
	
	app.post('/checkUser',urlencodedParser , function(req,res)
	{
		console.log(req) ; 
		const username = req.body.username ;
		const password = req.body.password ; 
		
		
		var query = 'select * from palash.users where username =\'' + username + '\' and password = \'' + password + '\'' ; 
		
		console.log(query); 
		connection.query(query , function(err , rows , fields){
			if(err ) throw err ;
			
			if(rows[0]){
				
				var details = {username : rows[0].username , 
						name : rows[0].fname ,
						lname : rows[0].lname ,
						dob : rows[0].dob , 
						gender : rows[0].gender} ; 
				
				res.render('loginSuccess',{data : details});
			}else{
				res.render('loginFailure');
			}
			
			
		})
		
		
	});
	
	
	
};