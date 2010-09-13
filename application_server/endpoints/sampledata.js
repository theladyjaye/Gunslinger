var match   = require('../data/match');
var game    = require('../data/game');

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
	
	var g1            = new game.Game();
	g1.label          = "Halo:Reach";
	g1._id            = "halo-reach";
	g1.platform       = "xbox360";
	                  
	var g2            = new game.Game();
	g2.label          = "Red Dead Redemption";
	g2._id            = "red-dead-redemption";
	g2.platform       = "ps3";
	                  
	var g3            = new game.Game();
	g3.label          = "Borderlands";
	g3._id             = "borderlands";
	g3.platform       = "xbox360";
	                  
	var g4            = new game.Game();
	g4.label          = "Starcraft 2";
	g4._id             = "starcraft2";
	g4.platform       = "pc";

	var g5            = new game.Game();
	g5.label          = "Gears of War 2";
	g5._id             = "gears-of-war-2";
	g5.platform       = "xbox360";
	
	
	var m1            = new match.Match();
	m1.created_by     = "ajackson";
	m1.label          = "Lorem ipsum dolor sit amet";
	m1.title          = g1.label;
	m1.platform       = g1.platform;
	m1.scheduled_time = new Date(fifteenMinutesFromNow); 
	m1.players.push(m1.created_by);
	
	var m2            = new match.Match();
	m2.created_by     = "jmadison";
	m2.label          = "Lorem ipsum dolor sit amet";
	m2.title          = g2.label;
	m2.platform       = g2.platform;
	m2.scheduled_time = new Date(thirtyMinutesFromNow);
	m2.players.push(m2.created_by);
	
	var m3            = new match.Match();
	m3.created_by     = "tjefferson";
	m3.label          = "Lorem ipsum dolor sit amet";
	m3.title          = g3.label;
	m3.platform       = g3.platform;
	m3.scheduled_time = new Date(fourtyFiveMinutesFromNow);
	m3.players.push(m3.created_by);
	
	var m4            = new match.Match();
	m4.created_by     = "alincoln";
	m4.label          = "Lorem ipsum dolor sit amet";
	m4.title          = g4.label;
	m4.platform       = g4.platform;
	m4.scheduled_time = new Date(twoHoursFromNow);
	m4.players.push(m4.created_by);
	
	var m5            = new match.Match();
	m5.created_by     = "alincoln";
	m5.label          = "Lorem ipsum dolor sit amet";
	m5.title          = g5.label;
	m5.platform       = g5.platform;
	m5.scheduled_time = new Date(sixHoursFromNow);
	m5.players.push(m5.created_by);
	
	db.saveDoc(g1);
	db.saveDoc(g2);
	db.saveDoc(g3);
	db.saveDoc(g4);
	db.saveDoc(g5);
	
	db.saveDoc(m1);
	db.saveDoc(m2);
	db.saveDoc(m3);
	db.saveDoc(m4);
	db.saveDoc(m5);
	
	next({"ok":true, "message":"done"});
}