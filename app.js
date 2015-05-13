var
  express   = require('express'),
  async     = require('async'),
  Sequelize = require('sequelize'),

  server    = require('./config/server'),
  schema    = require('./config/schema'),
  app       = express(),

  sequelize = new Sequelize(server.sql.database, server.sql.user, server.sql.password, {
    dialect : 'mysql',
    port    :    3306,
  })
;

app.use(function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', function(request, response) {
  response.send('Semantic API');
});


app.get('/search', function(request, response) {
  response.send('Please specify a search term');
});

app.get('/tags/:query', function(request, response, next) {
  var
    Animals   = sequelize.define('Animals', schema.animals, server.table.animals),
    query     = request.param('query') || false,
    apiResponse = {
      success: true,
      results: {}
    },
    getAnimals,
    results
  ;

  if(!query) {
    response.send('Please specify a search term');
  }

  getAnimals = function(next) {
    Animals
      .findAll({
        where: [
          "name LIKE '"+ query +"%'"
        ],
        limit: 3
      })
      .error(function(error) {
        response.send('Error');
        next();
      })
      .success(function(animals) {
        var
          results = [],
          count   = animals.length,
          index   = 0
        ;
        if(animals && count > 0) {
          while(index < count) {
            var
              animal = animals[index]
            ;
            // push animal to animals
            results.push({
              name  : animal.name,
              value : animal.name.toLowerCase().replace(' ', '-')
            });
            index++;
          }
          apiResponse.results = results;
        }
        next();
      })
    ;
  };

  response.type('application/json');
  sequelize
    .authenticate()
    .then(function() {
      async.series([
        getAnimals
      ], function() {
        response.json(apiResponse);
      });
    })
  ;

});

app.get('/search/category/:query', function(request, response, next) {
  var
    Animals   = sequelize.define('Animals', schema.animals, server.table.animals),
    Passwords = sequelize.define('Passwords', schema.passwords, server.table.passwords),
    Pets      = sequelize.define('Pets', schema.pets, server.table.pets),
    query     = request.param('query') || false,
    apiResponse = {
      success: true,
      results: {}
    },
    getAnimals,
    getPasswords,
    getDogs,
    getCats,
    results
  ;

  if(!query) {
    response.send('Please specify a search term');
  }
  getAnimals = function(next) {
    Animals
      .findAll({
        where: [
          "name LIKE '"+ query +"%'"
        ],
        limit: 3
      })
      .error(function(error) {
        response.send('Error');
        next();
      })
      .success(function(results) {
        var
          category = {},
          count = results.length,
          index = 0
        ;
        if(results && count > 0) {
          category.name = 'Animals';
          category.results = [];
          while(index < count) {
            var animal = results[index];
            // push animal to results
            category.results.push({
              title       : animal.name,
              description : animal.status
            });
            index++;
          }
          apiResponse.results.animals = category;
        }
        next();
      })
    ;
  };
  getPasswords = function(next) {
    Passwords
      .findAll({
        where: [
          "password LIKE '"+ query +"%'"
        ],
        limit: 3
      })
      .error(function(error) {
        response.send('Error');
        next();
      })
      .success(function(results) {
        var
          category = {},
          count = results.length,
          index = 0
        ;
        if(results && count > 0) {
          category.name = 'Passwords';
          category.results = [];
          while(index < count) {
            var password = results[index];
            category.results.push({
              title       : password.password
            });
            index++;
          }
          apiResponse.results.passwords = category;
        }
        next();
      })
    ;
  };
  getDogs = function(next) {
    Pets
      .findAll({
        where: [
          "name LIKE '"+ query +"%'",
          "type = 'Dog'"
        ],
        limit: 3
      })
      .error(function(error) {
        response.json(error);
        next();
      })
      .success(function(results) {
        var
          category = {},
          count = results.length,
          index = 0
        ;
        if(results && count > 0) {
          category.name = 'Dogs';
          category.results = [];
          while(index < count) {
            var pet = results[index];
            var suffix = (pet.rank == 1)
              ? 'st'
              : (pet.rank == 2)
                ? 'nd'
                : (pet.rank == 3)
                  ? 'rd'
                  : 'th'
            ;
            category.results.push({
              title       : pet.name,
              description : pet.rank + suffix + ' most popular ' + pet.gender + ' name'
            });
            index++;
          }
          apiResponse.results.dogs = category;
        }
        next();
      })
    ;
  };
  getCats = function(next) {
    Pets
      .findAll({
        where: [
          "name LIKE '"+ query +"%'",
          "type = 'Cat'"
        ],
        limit: 3
      })
      .error(function(error) {
        response.json(error);
        next();
      })
      .success(function(results) {
        var
          category = {},
          count = results.length,
          index = 0
        ;
        if(results && count > 0) {
          category.name = 'Cats';
          category.results = [];
          while(index < count) {
            var pet = results[index];
            var suffix = (pet.rank == 1)
              ? 'st'
              : (pet.rank == 2)
                ? 'nd'
                : (pet.rank == 3)
                  ? 'rd'
                  : 'th'
            ;
            category.results.push({
              title       : pet.name,
              description : pet.rank + suffix + ' most popular ' + pet.gender + ' name'
            });
            index++;
          }
          apiResponse.results.cats = category;
        }
        next();
      })
    ;
  };

  response.type('application/json');
  sequelize
    .authenticate()
    .then(function() {
      async.series([
        getAnimals,
        getPasswords,
        getDogs,
        getCats
      ], function() {
        response.json(apiResponse);
      });
    })
  ;
});

app.get('/search/:query', function(request, response, next) {
  var
    Passwords = sequelize.define('Passwords', schema.passwords, server.table.passwords),
    query     = request.param('query') || false,
    apiResponse = {
      success: true,
      results: {}
    },
    getPasswords,
    results
  ;

  if(!query) {
    response.send('Please specify a search term');
  }
  getPasswords = function(next) {
    Passwords
      .findAll({
        where: [
          "password LIKE '"+ query +"%'"
        ],
        limit: 3
      })
      .error(function(error) {
        response.send('Error');
        next();
      })
      .success(function(passwords) {
        var
          results  = [],
          count    = passwords.length,
          index    = 0
        ;
        if(passwords && count > 0) {
          while(index < count) {
            var password = passwords[index];
            results.push({
              title       : password.password
            });
            index++;
          }
          apiResponse.results = results;
        }
        next();
      })
    ;
  };

  response.type('application/json');
  sequelize
    .authenticate()
    .then(function() {
      async.series([
        getPasswords
      ], function() {
        response.json(apiResponse);
      });
    })
  ;
});

app.listen(3000);
