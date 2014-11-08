var
  express   = require('express'),
  mysql     = require('mysql'),
  Sequelize = require('sequelize'),

  config    = require('./config/server'),
  app       = express(),

  sequelize = new Sequelize(config.sql.database, config.sql.user, config.sql.password, {
    dialect : 'mysql',
    port    :    3306,
  }),
  apiResponse = { success: true }
;


app.get('/', function(request, response) {
  response.send('Semantic API');
});

app.get('/search', function(request, response) {
  response.send('Please specify a search term');
});

app.get('/search/:query', function(request, response, next) {
  var
    Animals   = sequelize.define('Animals', config.schema.animals, config.table.animals),
    Passwords = sequelize.define('Passwords', config.schema.passwords, config.table.passwords),
    Pets      = sequelize.define('Pets', config.schema.pets, config.table.pets),
    query     = request.param('query') || false,
    category,
    results
  ;

  if(!query) {
    response.send('Please specify a search term');
  }
  sequelize
    .authenticate()
    .complete(function() {
      Animals
        .findAndCountAll({
          where: [
            "name LIKE '"+query+"%'"
          ],
          limit: 5
        })
        .complete(function(error, results) {
          if(!!error) {
            response.send('An error occurred while searching', error);
          }
          if(results && results.count > 0) {
            category.name = 'Animals';
            category.results = {};
            for(var index in results) {
              var animal = results[index];
              // push animal to results
              category.results.push({
                title       : animal.name,
                description : animal.status
              });
            }
            apiResponse.results.push(category);
          }
        })
      ;
      response.json(apiResponse);
    })
  ;
});

app.listen(3000);
