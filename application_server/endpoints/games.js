exports.endpoints = function(app)
{
	app.get('/', getGames);
}

function getGames(req, res, next)
{
	next({"ok":true, "message":"will be recent games list"});
}