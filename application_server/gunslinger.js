require.paths.unshift("/usr/local/lib/node");

var connect   = require('connect');
var form      = require('connect-form');
var main      = require('./endpoints/main');
//var player    = require('./endpoints/player');
//var session   = require('./endpoints/session');

var server = connect.createServer(
	form({ keepExtensions: false }),
	connect.logger({ buffer: true })
);

var vhost = connect.vhost('gunslinger', server);

server.use("/www", connect.staticProvider(__dirname + '/www'));
server.use(main.defaultResponse);
server.use(main.renderResponse);
//server.use("/player/", connect.router(player.endpoints));
//server.use("/session/", connect.router(session.endpoints));

server.listen(80);

console.log('Gunslinger server listening on port 80');