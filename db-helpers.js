var ActiveRecord = require('activerecord');
var path = require('path');

module.exports = new ActiveRecord.Configuration
  mysql:
    database:path.join(__dirname,'/test.db'))

