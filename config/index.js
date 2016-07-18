var path = require('path'),
    env  = process.env.NODE_ENV || 'development';

// ====  initialize config ====
var config = {};
config['server']    = require(path.join(__dirname, 'server.json'))[env];

module.exports = config;
