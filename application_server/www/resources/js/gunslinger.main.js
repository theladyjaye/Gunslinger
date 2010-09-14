$(function() {	
	
	// join game
	$("body").delegate(".open a", "click", function() {
		var $this = $(this),
			username = "xXHitmanXx";
			match = $this.parents(".match").attr("id");
		
		$.post("/matches/join", {username: username, match: match}, function(response) {
			$this.html(username).parents("li").removeClass("open");
		});
		
		return false;
	});
	
	// new game form
	$("#frm-new-game").submit(function() {
		
		var form_data = utils.querystring_to_object($(this).serialize());
		
		// get scheduled time
		var date = new Date(form_data.date); // create date from datepicker
		form_data.hour = parseInt(form_data.hour); // parse hour to int
		if(form_data.meridiem == "pm") // set hour based on meridiem
		{
			form_data.hour += form_data.hour + 12;
		}

		date.setHours(form_data.hour); 
		date.setMinutes(parseInt(form_data.minute)); 
 		
		form_data.scheduled_time = date.toString(); 
	

		
		// get attending players
		var players = [];
		$.each($("#attendees .player").get(), function() {
			players.push($(this).text());
		});
		
		form_data.players = players;
		
		// determine maxPlayers (creator + players + extras)
		form_data.maxPlayers = 1 + players.length + parseInt(form_data.additional_open_spots);
		
		// clean up additional open spots
		delete form_data.addtional_open_spots;
		// clean up date info in form_data
		delete form_data.date;
		delete form_data.minute;
		delete form_data.hour;
		delete form_data.meridiem;
		
	//	console.log(form_data);
		$.post("/matches/create", form_data, function(response) {
			console.log(response);
		});
		
		return false;
	});
	
	
	// console filter in lobby
	$("#dd-console").change(function() {
		var val = $(this).val();
		
		$("#lobby .game-table .console").parents("li").hide();
		$("#lobby .game-table .console." + val).parents("li").show();
	});
	
	
	// date picker 
	$("#datepicker").datepicker();


	// attendees autocomplete
	setup_attendees();
	
	// run sammy
	app.run("#/lobby");
	
});

function setup_attendees()
{
	var availableTags = ["ajackson", "jmadison", "tjefferson", "alincoln"];

	$("#dd-attendees").autocomplete({
		minLength: 0,
		source: availableTags,
		focus: function() {
			// prevent value inserted on focus
			return false;
		},
		select: function(event, ui) {
			this.value = "";
			
			$("<p />", {
				html: '<span class="player">' + ui.item.value + '</span><a href="#" class="delete">x</a>'
			}).appendTo("#attendees");
			
			return false;
		}
	});
	
	
	$("#attendees").delegate("a.delete", "click", function() {
		$(this).parents("p").fadeOut(200, function() {
			$(this).remove();
		});
		return false;
	});
}

function change_page(page_id)
{
	$(".page").filter(function() {
		return $(this).attr("id") != page_id;
	}).fadeOut();
	
	$("#" + page_id).delay(300).fadeIn();
	
	change_nav(page_id);
}

function change_nav(page_id)
{
	$("#nav").find("a").removeClass("on");
	$("#nav a[href=#/" + page_id + "]").addClass("on");
}

// sammy
var app = $.sammy(function() {
	// turn off logging
    Sammy.log = this.log = function() {};
	
	var template_path = "/www/resources/templates/";
	
	// routes
	this.get("#/lobby", function() {
		$.getJSON("/matches", function(json) {
			if(json.ok && json.matches)
			{
				$("#lobby .game-table").html("").render_template({
					"name": "match",
					"path": template_path,
					"data": {"matches": json.matches},
					"complete": function() {
						change_page("lobby");			
					}
				});
			}
		});
	}).get("#/schedule", function() {
		// reset form
		$("#frm-new-game")[0].reset();
		
		$.getJSON("/games", function(json) {
			if(json.ok && json.games)
			{
				var $dd_game = $("#dd-game").html("");
				
				for(var i = 0, len = json.games.length, game; i < len; i++)
				{
					game = json.games[i];

					$("<option />", {
						"value": game._id.split("/")[1],
						"html": game.label + " | " + utils.get_console(game.platform).toUpperCase()
					}).appendTo($dd_game);
				}
				change_page("schedule");			
			}
		});
	}).get("#/profile", function() {
		$.post("/matches/scheduled", {username: "xXHitmanXx"}, function(json) {
			if(json.ok)
			{
				$("#profile .game-table").html("").render_template({
					"name": "match",
					"path": template_path,
					"data": {"matches": json.matches,
							 "is_profile": true
							},
					"complete": function() {
						change_page("profile");			
					}
				});
			}
		}, 'json');
	});
});

// UTILS
var utils = {
	sanitize_user: function(user) 
	{
		return user.split("/")[1];
	},
	get_console: function(platform)
	{		
		if(platform == "xbox360")
		{
			platform = "XBOX 360";
		}
		
		return platform;
	},
	format_time: function(date)
	{
		date = new Date(date);
		
		var hours = date.getHours() + 1,
			minutes = date.getMinutes().toString(),
			meridian = "am";
		
 		if(hours > 12)
		{
			hours = hours % 12;
			meridian = "pm";
		}

		if(minutes.length < 2)
		{
			minutes = "0" + minutes;
		}
		
		return hours + ":" + minutes + " " + meridian;
	},
	elapsed_time: function(created_at)
	{
		var now 	= new Date(),
			created = new Date();
			
		created.setFullYear(created_at.substr(0, 4));
		created.setMonth(created_at.substr(5, 2) - 1);
		created.setDate(created_at.substr(8, 2));
		created.setHours(created_at.substr(11, 2));
		created.setMinutes(created_at.substr(14, 2));
		created.setSeconds(created_at.substr(17, 2));			

		now.setHours(now.getHours() - 1);
		var age_in_seconds = (created.getTime() - now.getTime()) / 1000;

		var s = function(n) { 
			return n == 1 ? '' : 's' 
		};
		
	    if (age_in_seconds < 0) 
		{
	        return 'just now';
	    }
	    if (age_in_seconds < 60) 
		{
	        var n = age_in_seconds;
	        return n + ' second' + s(n) + ' ago';
	    }
	    if (age_in_seconds < 60 * 60) 
		{
	        var n = Math.floor(age_in_seconds/60);
	        return n + ' minute' + s(n) + ' ago';
	    }
	    if (age_in_seconds < 60 * 60 * 24) 
		{
	        var n = Math.floor(age_in_seconds/60/60);
	        return n + ' hour' + s(n) + ' ago';
	    }
	    if (age_in_seconds < 60 * 60 * 24 * 7)
	 	{
	        var n = Math.floor(age_in_seconds/60/60/24);
	        return n + ' day' + s(n) + ' ago';
	    }
	    if (age_in_seconds < 60 * 60 * 24 * 31) 
		{
	        var n = Math.floor(age_in_seconds/60/60/24/7);
	        return n + ' week' + s(n) + ' ago';
	    }
	    if (age_in_seconds < 60 * 60 * 24 * 365) 
		{
	        var n = Math.floor(age_in_seconds/60/60/24/31);
	        return n + ' month' + s(n) + ' ago';
	    }
	    var n = Math.floor(age_in_seconds/60/60/24/365);
	
	    return n + ' year' + s(n) + ' ago';
	},
	get_open_spots: function(players, max_spots)
	{
		var	ary = [];
			
		for(var i = 0, len = max_spots - players.length; i < len; i++)
		{
			ary.push("open");
		}
		
		return ary;
	},
	querystring_to_object: function(querystring)
	{
		var result = {};
		
		querystring.replace(/([^=&]+)=([^&]*)/g, function(match, key, value) {
			result[unescape(key)] = unescape(value);
		});
		
		return result;
	}
};