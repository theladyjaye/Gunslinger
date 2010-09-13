var games   = require('../data/games');
var couchdb = require('../libs/node-couchdb/lib/couchdb'),
    client  = couchdb.createClient(5984, 'localhost'),
    db      = client.db('gunslinger');

exports.endpoints = function(app)
{
	app.get('/', initialize);
}

function initialize(req, res, next)
{
	var now    = new Date();
	var minute = 60000;
	var hour   = 3600000;
	
	
	var fifteenMinutesFromNow    = now.getTime() + (15 * minute);
	var thirtyMinutesFromNow     = now.getTime() + (30 * minute);
	var fourtyFiveMinutesFromNow = now.getTime() + (30 * minute);
	var twoHoursFromNow          = now.getTime() + (2 * hour);
	var sixHoursFromNow          = now.getTime() + (6 * hour);
	
	db.remove();
	db.create();
	
	var g1            = new games.Game();
	g1.created_by     = "ajackson";
	g1.label          = "Lorem ipsum dolor sit amet";
	g1.title          = "Halo: Reach";
	g1.platform       = "xbox360";
	g1.scheduled_time = new Date(fifteenMinutesFromNow); 
	
	var g2            = new games.Game();
	g2.created_by     = "jmadison";
	g2.label          = "Lorem ipsum dolor sit amet";
	g2.title          = "Red Dead Redemption";
	g2.platform       = "ps3";
	g2.scheduled_time = new Date(thirtyMinutesFromNow);
	
	var g3            = new games.Game();
	g3.created_by     = "tjefferson";
	g3.label          = "Lorem ipsum dolor sit amet";
	g3.title          = "Borderlands";
	g3.platform       = "xbox360";
	g3.scheduled_time = new Date(fourtyFiveMinutesFromNow);
	
	var g4            = new games.Game();
	g4.created_by     = "alincoln";
	g4.label          = "Lorem ipsum dolor sit amet";
	g4.title          = "Starcraft 2";
	g4.platform       = "pc";
	g4.scheduled_time = new Date(twoHoursFromNow);
	
	var g5            = new games.Game();
	g5.created_by     = "alincoln";
	g5.label          = "Lorem ipsum dolor sit amet";
	g5.title          = "Gears of War 2";
	g5.platform       = "xbox360";
	g5.scheduled_time = new Date(sixHoursFromNow);
	
	db.saveDoc(g1);
	db.saveDoc(g2);
	db.saveDoc(g3);
	db.saveDoc(g4);
	db.saveDoc(g5);
	
	next({"ok":true, "message":"done"});
}