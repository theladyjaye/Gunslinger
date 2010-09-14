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
				db.view("gunslinger", "matches-scheduled", {"include_docs":true, "startkey":['user/'+fields.username, null], "endkey":['user/'+fields.username, {}]}, function(error, data)
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
							match.maxPlayers     = fields.maxPlayers <= 12 fields.maxPlayers : 12;
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
						next({"ok":false, "message":"invalid game - " + fields.game})
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