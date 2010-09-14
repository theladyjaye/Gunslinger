var couchdb    = require('../libs/node-couchdb/lib/couchdb'),
    client     = couchdb.createClient(5984, 'localhost'),
    db         = client.db('gunslinger'),
    formidable = require('formidable'),
    matches    = require('../data/match');

exports.endpoints = function(app)
{
	app.get('/', getMatches);
	app.post('/create', createMatch);
	app.post('/scheduled', getScheduledMatches);
	app.post('/join', joinMatch);
}

function joinMatch(req, res, next)
{
	if(req.headers["content-length"] > 0)
	{
		var form = req.form = new formidable.IncomingForm;
		
		form.parse(req, function(err, fields, files)
		{
			if(typeof fields.username == "undefined" || typeof fields.match == "undefined")
			{
				next({"ok":false, "message":"invalid username or match id"});
			}
			else
			{
				db.getDoc(encodeURIComponent(fields.match), function(errorMatch, match)
				{
					if(errorMatch == null)
					{
						var canJoinMatch = true;
						var username     = "user/" + fields.username;
						
						// is the username already in the current match?
						for(var i in match.players)
						{
							
							if(match.players[i] == username)
								canJoinMatch = false;
						}
						
						if(canJoinMatch)
						{
							db.view("gunslinger", "matches-scheduled", {"include_docs":true, "startkey":['user/'+fields.username, null], "endkey":['user/'+fields.username, {}]}, function(errorScheduled, data)
							{
								if(errorScheduled == null)
								{
									for(var i in data.rows)
									{
										/*
											TODO do any time comparissions / schedule conflicts here
										*/
										//var current = data.rows[i].doc;
									}
								
									if(canJoinMatch)
									{
										match.players.push(username);
										db.saveDoc(match, function(error, data)
										{
											if(error == null)
											{
												next({"ok":true, "message":"successfully joined match"});
											}
											else
											{
												next({"ok":false, "message":"unable to save update match, you have not joined this match"})
											}
										});
									}
									else
									{
										next({"ok":false, "message":"you are not eligible to join this match"});
									}
								}
								else
								{
									next({"ok":false, "message":"unable to retrieve scheduled games"});
								}
							});
						}
						else
						{
							next({"ok":false, "message":"you are already a member of this match"});
						}
					}
					else
					{
						next({"ok":false, "message":"invalid game"})
					}
				});
			}
		});
	}
	else
	{
		next({"ok":false, "message":"invalid request"});
	}
}

function getScheduledMatches(req, res, next)
{
	if(req.headers["content-length"] > 0)
	{
		var form = req.form = new formidable.IncomingForm;
		
		form.parse(req, function(err, fields, files)
		{
			if(typeof fields.username == "undefined")
			{
				next({"ok":false, "message":"invalid username"});
			}
			else
			{
				db.view("gunslinger", "matches-scheduled", {"include_docs":true, "startkey":['user/'+fields.username.toLowerCase(), null], "endkey":['user/'+fields.username.toLowerCase(), {}]}, function(error, data)
				{
					if(error == null)
					{
						results = [];

						data.rows.forEach(function(row){
							results.push(row.doc);
						});

						next({"ok":true, "matches":results});
					}
					else
					{
						next({"ok":false, "message":error.message});
					}
				});
			}
		});
	}
	else
	{
		next({"ok":false, "message":"invalid request"});
	}
}

function createMatch(req, res, next)
{
	if(req.headers["content-length"] > 0)
	{
		var form = req.form = new formidable.IncomingForm;
	
		form.parse(req, function(err, fields, files)
		{
			if(typeof fields.username == "undefined" || typeof fields.scheduled_time == "undefined" )
			{
				next({"ok":false, "message":"invalid username or scheduled time"});
			}
			else
			{
				db.getDoc(encodeURIComponent('game/' + fields.game), function(error, game)
				{
					if(error == null)
					{
						var match                = new matches.Match();
							match.created_by     = 'user/'+fields.username;
							match.label          = fields.label;
							match.title          = game.label;
							match.platform       = game.platform;
							match.availability   = fields.availability == "private" ? "private" : "public";
							match.maxPlayers     = fields.maxPlayers <= 12 ? fields.maxPlayers : 12;
							match.scheduled_time = new Date(fields.scheduled_time); 
							
							match.players.push(match.created_by);
						
						if(typeof fields.players != "undefined" && fields.players instanceof Array)
						{
							var players = [];
							
							fields.players.forEach(function(player){
								players.push("user/"+player);
							})
							
							client.request({
							method: 'POST',
							path: '/gunslinger/_all_docs',
							data: {"keys":players}
							}, function(error, data)
							{
								for(var i in data.rows)
								{
									var object = data.rows[i];
									
									if(typeof object.error == "undefined" && object.key != match.created_by)
									{
										match.players.push(object.key);
									}
								}
								
								db.saveDoc(match, function(error, data)
								{
									if(error == null)
									{
										next({"ok":true, "match":data.id});
									}
									else
									{
										next({"ok":false, "message":"invalid"})
									}
								});
							
							});
						}
					}
					else
					{
						next({"ok":false, "message":"invalid game"})
					}
				});
			}
		});
	}
	else
	{
		next({"ok":false, "message":"invalid request"});
	}
}


function getMatches(req, res, next)
{
	db.view("gunslinger", "matches-recent", {"include_docs":true}, function(error, data)
	{
		if(error == null)
		{
			results = [];
			
			data.rows.forEach(function(row){
				results.push(row.doc);
			});
			
			next({"ok":true, "matches":results});
		}
		else
		{
			next({"ok":false, "message":error.message});
		}
	});
}