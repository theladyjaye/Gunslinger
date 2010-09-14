exports.Match = function()
{
	this.created_on     = new Date();
	this.created_by     = null;
	this.label          = null;
	this.title          = null;
	this.availability   = "public";
	this.scheduled_time = null;
	this.platform       = null;
	this.players        = [];
	this.type           = "match";
}
