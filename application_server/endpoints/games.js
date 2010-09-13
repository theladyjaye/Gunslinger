var couchdb = require('../libs/node-couchdb/lib/couchdb'),
    client  = couchdb.createClient(5984, 'localhost'),
    db      = client.db('gunslinger');

exports.endpoints = function(app)
{
	app.get('/', getMatches);
	app.post('/create', createMatch);
}


function createMatch(req, res, next)
{
	next({"message":"creating new match"});
}


function getMatches(req, res, next)
{
	db.view("gunslinger", "games-recent", {"include_docs":true}, function(error, data)
	{
		if(error == null)
		{
			results = [];
			
			data.rows.forEach(function(row){
				results.push(row.doc);
			});
			
			next({"ok":true, "games":results});
		}
		else
		{
			next({"ok":false, "message":error.message});
		}
	});
}