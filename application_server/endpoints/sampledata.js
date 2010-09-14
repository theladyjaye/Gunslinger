var couchdb  = require('../libs/node-couchdb/lib/couchdb'),
    client   = couchdb.createClient(5984, 'localhost'),
    db       = client.db('gunslinger'),
    sys      = require('sys'),
	spawn    = require('child_process').spawn,
	match    = require('../data/match'),
	game     = require('../data/game'),
	user     = require('../data/user');
	
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
	
	var couchapp = spawn('couchapp', ['push', './couchapp', 'gunslinger']);
	
	couchapp.on('exit', function (code) 
	{
		if (code !== 0) 
		{
			console.log('\n\ncouchapp push failed ' + code + '\n\n');
		}
		else
		{
			console.log('\n\ncouchapp push complete \n\n');
		}
	});
	
	
	
	var u1                = new user.User();
	    u1.email          = "ajackson@gmail.com";
	    u1.firstname      = "Andrew";
	    u1.lastname       = "Jackson";
	    u1._id            = "user/ajackson";
	    u1.profiles.push({"console":"xbox360", "gamertag":"rockinJacko"});
	    u1.profiles.push({"console":"xbox360", "gamertag":"jackOfAllTrades"});
	
	var u2                = new user.User();
	    u2.email          = "jmadison@gmail.com";
	    u2.firstname      = "James";
	    u2.lastname       = "Madison";
	    u2._id            = "user/jmadison";
	    u2.profiles.push({"console":"xbox360", "gamertag":"hazMadison"});
	
	var u3                = new user.User();
	    u3.email          = "tjefferson@gmail.com";
	    u3.firstname      = "Thomas";
	    u3.lastname       = "Jefferson";
	    u3._id            = "user/tjefferson";
	    u3.profiles.push({"console":"ps3", "gamertag":"HawtyMcBloggy"});
	    u3.profiles.push({"console":"wii", "gamertag":"TommyTwoTones"});
	
	var u4                = new user.User();
	    u4.email          = "alincoln@gmail.com";
	    u4.firstname      = "Abraham";
	    u4.lastname       = "Lincoln";
	    u4._id            = "user/alincoln";
	    u4.profiles.push({"console":"xbox360", "gamertag":"honestAbe"});
	
	var u5                = new user.User();
	    u5.email          = "aventurella@gmail.com";
	    u5.firstname      = "Adam";
	    u5.lastname       = "Venturella";
	    u5._id            = "user/aventurella";
	    u5.profiles.push({"console":"xbox360", "gamertag":"logix812"});
	
	var u6                = new user.User();
	    u6.email          = "philtobias@gmail.com";
	    u6.firstname      = "Phil";
	    u6.lastname       = "Tobias";
	    u6._id            = "user/philtobias";
	    u6.profiles.push({"console":"xbox360", "gamertag":"logix812"});
	
	var u7                = new user.User();
	    u7.email          = "philtobias@gmail.com";
	    u7.firstname      = "Phil";
	    u7.lastname       = "Tobias";
	    u7._id            = "user/xxhitmanxx";
	    u7.profiles.push({"console":"xbox360", "gamertag":"xXboxThree6oXx"});
	    u7.profiles.push({"console":"wii", "gamertag":"xXWiimanXx"});
	    u7.profiles.push({"console":"ps3", "gamertag":"xXPlea3eXx"});


	var g1                = new game.Game();
	    g1.label          = "Halo:Reach";
	    g1._id            = "game/halo-reach";
	    g1.platform       = "xbox360";
	                  
	var g2                = new game.Game();
	    g2.label          = "Red Dead Redemption";
	    g2._id            = "game/red-dead-redemption";
	    g2.platform       = "ps3";
	                  
	var g3                = new game.Game();
	    g3.label          = "Borderlands";
	    g3._id            = "game/borderlands";
	    g3.platform       = "xbox360";
	                  
	var g4                = new game.Game();
	    g4.label          = "Starcraft 2";
	    g4._id            = "game/starcraft2";
	    g4.platform       = "pc";

	var g5                = new game.Game();
	    g5.label          = "Gears of War 2";
	    g5._id            = "game/gears-of-war-2";
	    g5.platform       = "xbox360";
	
	var g6                = new game.Game();
	    g6.label          = "Mario Kart";
	    g6._id            = "game/mario-kart";
	    g6.platform       = "wii";
	
	var m1                = new match.Match();
	    m1.created_by     = u1._id;
	    m1.label          = "Lorem ipsum dolor sit amet";
	    m1.title          = g1.label;
	    m1.platform       = g1.platform;
	    m1.scheduled_time = new Date(fifteenMinutesFromNow); 
	    m1.maxPlayers     = 6;
	    m1.players.push(m1.created_by);
	
	var m2                = new match.Match();
	    m2.created_by     = u2._id;
	    m2.label          = "Lorem ipsum dolor sit amet";
	    m2.title          = g2.label;
	    m2.platform       = g2.platform;
	    m2.scheduled_time = new Date(thirtyMinutesFromNow);
	    m2.maxPlayers     = 4;
	    m2.players.push(m2.created_by);
	
	var m3                = new match.Match();
	    m3.created_by     = u3._id;
	    m3.label          = "Lorem ipsum dolor sit amet";
	    m3.title          = g3.label;
	    m3.platform       = g3.platform;
	    m3.scheduled_time = new Date(fourtyFiveMinutesFromNow);
	    m3.maxPlayers     = 2;
	    m3.players.push(m3.created_by);
	
	var m4                = new match.Match();
	    m4.created_by     = u4._id;
	    m4.label          = "Lorem ipsum dolor sit amet";
	    m4.title          = g4.label;
	    m4.platform       = g4.platform;
	    m4.scheduled_time = new Date(twoHoursFromNow);
	    m4.maxPlayers     = 8;
	    m4.players.push(m4.created_by);
	
	
	var m5                = new match.Match();
	    m5.created_by     = u4._id;
	    m5.label          = "Lorem ipsum dolor sit amet";
	    m5.title          = g5.label;
	    m5.platform       = g5.platform;
	    m5.scheduled_time = new Date(sixHoursFromNow);
	    m5.maxPlayers     = 10;
	    m5.players.push(m5.created_by);
	
	var m6                = new match.Match();
	    m6.created_by     = u4._id;
	    m6.label          = "Lorem ipsum dolor sit amet";
	    m6.title          = g6.label;
	    m6.platform       = g6.platform;
	    m6.scheduled_time = new Date(sixHoursFromNow);
	    m6.maxPlayers     = 4;
	    m6.players.push(m6.created_by);
	
	var m7                = new match.Match();
	    m7.created_by     = u7._id;
	    m7.label          = "Lorem ipsum dolor sit amet";
	    m7.title          = g6.label;
	    m7.platform       = g6.platform;
	    m7.scheduled_time = new Date(sixHoursFromNow);
	    m7.maxPlayers     = 4;
	    m7.players.push(m7.created_by);
	
	db.saveDoc(u1);
	db.saveDoc(u2);
	db.saveDoc(u3);
	db.saveDoc(u4);
	db.saveDoc(u5);
	db.saveDoc(u6);
	db.saveDoc(u7);
	
	db.saveDoc(g1);
	db.saveDoc(g2);
	db.saveDoc(g3);
	db.saveDoc(g4);
	db.saveDoc(g5);
	db.saveDoc(g6);
	
	db.saveDoc(m1);
	db.saveDoc(m2);
	db.saveDoc(m3);
	db.saveDoc(m4);
	db.saveDoc(m5);
	db.saveDoc(m6);
	db.saveDoc(m7);
	
	next({"ok":true, "message":"done"});
}