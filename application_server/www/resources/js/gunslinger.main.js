$(function() {
	
	$("#dd-console").change(function() {
		var val = $(this).val();
		
		$("#lobby .game-table .console").parents("li").hide();
		$("#lobby .game-table .console." + val).parents("li").show();
	});
	
	$("#datepicker").datepicker();
	
	// run sammy
	app.run("#/lobby");
	
});

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