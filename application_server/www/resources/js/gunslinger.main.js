$(function() {
	
	
	// new game form
	$("#frm-new-game").submit(function() {
		
		console.log($(this).serialize());
//		$.post("", $(this).serialize(), function(response) {
			
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


	setup_attendees();
	
	// run sammy
	app.run("#/lobby");
	
});

function setup_attendees()
{
	var availableTags = ["Cool Kid", "Nightowl", "Blockbuster Manager", "Brother", "Sister", "Uncle"];
	function split(val) {
		return val.split(/,\s*/);
	}
	function extractLast(term) {
		return split(term).pop();
	}

	$("#dd-attendees").autocomplete({
		minLength: 0,
		source: function(request, response) {
			// delegate back to autocomplete, but extract the last term
			response($.ui.autocomplete.filter(availableTags, extractLast(request.term)));
		},
		focus: function() {
			// prevent value inserted on focus
			return false;
		},
		select: function(event, ui) {
			/*var terms = split( this.value );
			// remove the current input
			terms.pop();
			// add the selected item
			terms.push( ui.item.value );
			// add placeholder to get the comma-and-space at the end
			terms.push("");
			this.value = terms.join(", ");
			*/
			
			$("<p />", {
				html: ui.item.value
			}).appendTo("#attendees");
			
			return false;
		}
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
	
	// routes
	this.get("#/lobby", function() {
		change_page("lobby");
	}).get("#/schedule", function() {
		change_page("schedule");
	}).get("#/profile", function() {
		change_page("profile");
	});
});