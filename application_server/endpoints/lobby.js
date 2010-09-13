exports.endpoints = function(app)
{
	app.post('/request', getSession);
}