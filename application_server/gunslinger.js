require.paths.unshift("/usr/local/lib/node");

var connect      = require('connect');
var form         = require('connect-form');
var main         = require('./endpoints/main');
var games        = require('./endpoints/games');
var sampledata   = require('./endpoints/sampledata');


var server = connect.createServer(
	form({ keepExtensions: false }),
	connect.logger({ buffer: true })
);

var vhost = connect.vhost('gunslinger', server);

server.use("/www", connect.staticProvider(__dirname + '/www'));
server.use("/www/resources/css", connect.staticProvider(__dirname + '/www/resources/css'));
server.use("/www/resources/img", connect.staticProvider(__dirname + '/www/resources/img'));
server.use("/www/resources/js", connect.staticProvider(__dirname + '/www/resources/js'));
server.use("/www/resources/templates", connect.staticProvider(__dirname + '/www/resources/templates'));

server.use("/sampledata/", connect.router(sampledata.endpoints));
server.use("/games/", connect.router(games.endpoints));


server.use(main.defaultResponse);
server.use(main.renderResponse);

//server.use("/session/", connect.router(session.endpoints));

server.listen(80);

console.log('Gunslinger server listening on port 80');