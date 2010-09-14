$(function() {
	
	
	// new game form
	$("#frm-new-game").submit(function() {
		
		console.log($(this).serialize());
		console.log($("#attendees .player").get())
//		$.post("/matches/create", $(this).serialize(), function(response) {
			
//		});
		
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
	var availableTags = ["Cool Kid", "Nightowl", "Blockbuster Manager", "Brother", "Sister", "Uncle"];

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
				html: '<span class="player">' + ui.item.value + '<span><a href="#" class="delete">x</a>'
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
		$.getJSON("/games", function(json) {
			if(json.ok && json.games)
			{
				var $dd_game = $("#dd-game").html("");
				
				for(var i = 0, len = json.games.length, game; i < len; i++)
				{
					game = json.games[i];

					$("<option />", {
						"value": game._id,
						"html": game.label + " | " + utils.get_console(game.platform).toUpperCase()
					}).appendTo($dd_game);
				}
				change_page("schedule");			
			}
		});
	}).get("#/profile", function() {
		$.getJSON("/matches", function(json) {
			if(json.ok && json.matches)
			{
				$("#profile .game-table").html("").render_template({
					"name": "match",
					"path": template_path,
					"data": {"matches": json.matches},
					"complete": function() {
						change_page("profile");			
					}
				});
			}
		});
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
			meridian = "am";
		
 		if(hours > 12)
		{
			hours = hours % 12;
			meridian = "pm";
		}
		
		return hours + ":" + date.getMinutes() + " " + meridian;
	},
	get_open_spots: function(players)
	{
		var max_spots = 12,
			ary = [];
			
		for(var i = 0, len = max_spots - players.length; i < len; i++)
		{
			ary.push("open");
		}
		
		return ary;
	}
};