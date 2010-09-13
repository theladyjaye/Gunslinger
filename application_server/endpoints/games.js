var couchdb = require('../libs/node-couchdb/lib/couchdb'),
    client  = couchdb.createClient(5984, 'localhost'),
    db      = client.db('gunslinger');

var utils = require('connect/utils'),
    formidable = require('formidable');

exports.endpoints = function(app)
{
	app.get('/', getMatches);
	app.post('/create', createMatch);
}


function createMatch(req, res, next)
{
	if(req.form)
	{
		console.log(req.form);
		req.form.onEnd = function(err, fields, files){
			console.log("FORM COMPLETE");
			
		}
		
		next({"message":"FORM SUBMITTED"});
	}
	else
	{
		next({"message":"creating new match"});
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