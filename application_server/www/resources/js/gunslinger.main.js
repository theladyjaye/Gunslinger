$(function() {
	
	// nav
	$("#nav").delegate("a", "click", function() {
		var page = $(this).attr("href").substr(1);
		$(".page").hide();
		$("#" + page).show();
		return false;
	});
	
	$("#dd-console").change(function() {
		var val = $(this).val();
		
		$("#lobby .game-table .console").parents("li").hide();
		$("#lobby .game-table .console." + val).parents("li").show();
	});
	
	$("#datepicker").datepicker();
});