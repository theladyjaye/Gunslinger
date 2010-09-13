$(function() {
	$("#dd-console").change(function() {
		var val = $(this).val();
		
		$(".game-table .console").parents("li").hide();
		$(".game-table .console." + val).parents("li").show();
		
	});
});