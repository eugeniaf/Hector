angular.module('starter.services', [])

  //****** SERVICIOS DE LOCALSTORGAE (sirve para guardar datos en memoria)
  //************************************
  .factory('$localstorage', ['$window', function ($window) {
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }])

  .factory('Entrenamientos', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var entrenamientos = [{ id: 0,
      profesor: 'Carlos',
      fecha: '2016-11-09',       
      items: [{
        id: 0,
        atleta: 'Eugenia',
        rutinas: [{
          id: 0,
          name: 'Esta es la primer rutina de Eugenia'
        }, {
            id: 1,
            name: 'Esta es la segunda rutina de Eugenia'
          }]
        }, {
          id: 1,
          atleta: 'Martín',
          rutinas: [{
            id: 0,
            name: 'Esta es la primer rutina de Martín'
          }, {
              id: 1,
              name: 'Esta es la segunda rutina de Martín'
            }]
      }]
    }];

    return {
      all: function () {
        return entrenamientos;
      },
      remove: function (entrenamiento) {
        entrenamientos.splice(chats.indexOf(entrenamiento), 1);
      },
      get: function (entrenamientoId) {
        for (var i = 0; i < entrenamientos.length; i++) {
          if (entrenamientos[i].id === parseInt(entrenamientoId)) {
            return entrenamientos[i];
          }
        }
        return null;
      },
      getFecha: function (fecha, profesor) {

        for (var i = 0; i < entrenamientos.length; i++) {
          //console.log("entrenamientos[i]: " + JSON.stringify(entrenamientos[i].items))
          if (entrenamientos[i].fecha === fecha && entrenamientos[i].profesor === profesor) {
            return entrenamientos[i].items;
          }
        }
        return null;
      }
    };
  })
  
    //****** SERVICIOS DE LOGIN
    //************************************
    .factory('login', function ($http, $localstorage) {
        
        // servicio expuesto
        return {
            // se conecta a la API y valida las credenciales de un usuario
            in: function (nombre, contrasena, callback) {
                var header = {headers: {'Content-Type': 'application/json'}}
                var body = JSON.stringify({
                  nombre: nombre,
                  contrasena: contrasena
                });
                $http.post('https://hectorapi.herokuapp.com/api/authenticate', body, header).then(function(resp){
                  console.log('Success', resp.data); // JSON object
                    $localstorage.set("access_token", resp.data.token)
                    return callback(null, true)                  
                }, function(err){
                  alert("Error!")
                  console.error('ERR', err);
                  return callback("Intente más tarde", false)
                })
            }
        }
    })

  .factory('Ejercicios', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var entrenamientos = [{
      id: 0,
      name: 'Ejercicio 1',
      description: 'Este es el ejercicio 1'
    }, {
        id: 1,
        name: 'Ejercicio 2',
        description: 'Este es el ejercicio 2'
      }];

    return {
      all: function () {
        return entrenamientos;
      },
      remove: function (entrenamiento) {
        entrenamientos.splice(chats.indexOf(entrenamiento), 1);
      },
      get: function (entrenamientoId) {
        for (var i = 0; i < entrenamientos.length; i++) {
          if (entrenamientos[i].id === parseInt(entrenamientoId)) {
            return entrenamientos[i];

          }
        }
        return null;
      }
    };
  })

  .factory('Rutinas', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var rutinas = [{
      id: 0,
      name: 'Rutina 1',
      description: 'Esta es la primer rutina'
    }, {
        id: 1,
        name: 'Rutina 2',
        description: 'Esta es la segunda rutina'
      }];

    return {
      all: function () {
        return rutinas;
      },
      remove: function (rutina) {
        rutinas.splice(chats.indexOf(rutina), 1);
      },
      get: function (rutinaId) {
        for (var i = 0; i < rutinas.length; i++) {
          if (rutinas[i].id === parseInt(rutinaId)) {
            return rutinas[i];
          }
        }
        return null;
      }
    };
  })



  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
      }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
      }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
