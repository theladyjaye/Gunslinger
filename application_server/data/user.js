exports.User = function()
{
	this.created_on     = new Date();
	this.firstname      = null;
	this.lastname       = null;
	this.email          = null;
	this.profiles       = [];
	this.type           = "user";
}
