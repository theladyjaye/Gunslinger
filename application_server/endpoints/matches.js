var couchdb    = require('../libs/node-couchdb/lib/couchdb'),
    client     = couchdb.createClient(5984, 'localhost'),
    db         = client.db('gunslinger'),
    formidable = require('formidable'),
    matches    = require('../data/match');

exports.endpoints = function(app)
{
	app.get('/', getMatches);
	app.post('/create', createMatch);
}

function createMatch(req, res, next)
{
	if(req.headers["content-length"] > 0)
	{
		var form = req.form = new formidable.IncomingForm;
	
		form.parse(req, function(err, fields, files)
		{
			if(typeof fields.username == "undefined")
			{
				next({"ok":false, "message":"invalid"});
			}
			else
			{
				db.getDoc(fields.game, function(error, game)
				{
					if(error == null)
					{
						var match                = new matches.Match();
							match.created_by     = fields.username;
							match.label          = fields.label;
							match.title          = game.label;
							match.platform       = game.platform;
							match.availability   = fields.availability == "private" ? "private" : "public";
							match.scheduled_time = new Date(fields.scheduled_time); 
							
						match.players.push(match.created_by);
						
						if(typeof fields.players != "undefined" && fields.players instanceof Array)
						{
							console.log(fields.players);
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
					}
					else
					{
						next({"ok":false, "message":"invalid"})
					}
				});
			}
		});
	}
	else
	{
		next({"ok":false, "message":"invalid"});
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