angular.module('starter.controllers', [])

  //***** CONTROLADOR LOGIN
  //************************************************
  .controller('LoginCtrl', function ($scope, login, $state, $ionicLoading, $ionicPopup, $ionicHistory, $localstorage) {

    // se crea la estructura user, luego aquí se reciben el usuario y la contraseña
    $scope.user = {}

    $localstorage.set("access_token", null)
    $localstorage.set("atleta", true)

    // función que se ejecuta al presionar el boton Entrar, valida que las credenciales del usuario sean correctas
    $scope.signIn = function () {

      $ionicLoading.show({
        template: 'Ingresando'
      })

      // ejecuta el servicio login
      login.in($scope.user.nombre, $scope.user.pass, function (err, valid) {
        $ionicLoading.hide();
        if (!valid) {
          $ionicPopup.alert({
            title: 'Upps',
            template: 'Usuario o contraseña incorrecta'
          });
        }
        // si las credenciales son correctas, borro el historial y navego a la pantalla de inicio
        if (valid) {
          $ionicHistory.clearHistory()
          $ionicHistory.clearCache().then(function () {
              $state.go('tab.calendario')
          });
        };
      });
    };
    //---        
  })

  .controller('RegistroCtrl', function ($scope, $http, $state, $ionicLoading, $ionicPopup, $ionicHistory, $localstorage) {

    // se crea la estructura user, luego aquí se reciben el usuario y la contraseña
    $scope.user = {}

    $localstorage.set("access_token", null)
    $localstorage.set("atleta", true)

    // función que se ejecuta al presionar el boton Entrar, valida que las credenciales del usuario sean correctas
    $scope.registrarse = function () {

      $ionicLoading.show({
        template: 'Procesando'
      })

      // se conecta a la API y registra el usuario
      var header = { headers: { 'Content-Type': 'application/json' } }
      var body = JSON.stringify({
        nombre: $scope.user.username,
        contrasena: $scope.user.pass,
        nombreApellido: $scope.user.nombreApellido
      });
      $http.post('https://hectorapi.herokuapp.com/api/usuarios', body, header)
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          console.log('data success - alta');
          console.log(JSON.stringify(data));

          $ionicPopup.alert({
            title: 'Bienvenido!',
            template: 'Fuiste registrado correctamente'
          })
            .then(function (res) {
              $ionicHistory.clearHistory()
              $ionicHistory.clearCache().then(function () {
                $state.go('login')
              })
            });

        })
        .error(function (data, status, headers, config) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Upps',
            template: 'Verifique su información'
          });
          console.log(JSON.stringify(data))
        })
    }
  })

  .controller('CalendarioAtletaCtrl', function ($ionicLoading, $rootScope, $localstorage, $log, $scope, Rutinas, $ionicScrollDelegate) {

    console.log("CalendarioAtletaCtrl")

    $scope.cambiarPerfil = function () {
      console.log("funcion cambiar perfil: " + $localstorage.get("atleta"))
      if ($localstorage.get("atleta") === "true") {
        console.log("es atleta")
        $localstorage.set("atleta", false)

        $rootScope.sampleStatus = $localstorage.get("atleta");

      } else {
        console.log("no es atleta")
        $localstorage.set("atleta", true)

        $rootScope.sampleStatus = $localstorage.get("atleta");
      }
    }

    // Obtengo el día en la semana donde me ubico
    $scope.fecha = new Date();  // por defecto el día calendario donde me encuentro
    //diaSemana($scope);

  })

  .controller('CalendarioCtrl', function ($ionicLoading, $ionicPopup, $http, $state, $rootScope, $localstorage, $log, $scope, $ionicPopover, $ionicScrollDelegate) {

    console.log("CalendarioCtrl")
    var token = $localstorage.get("access_token")
    var vm = this;
    if ($localstorage.get("atleta")=='true') {
      //$scope.perfil = "atleta"
      vm.textoPerfil = 'Entrenamientos recibidos'
    } else {
      //$scope.perfil = "profesor"
      vm.textoPerfil = 'Entrenamientos enviados'
    }
    vm.esAtleta = $localstorage.get("atleta")

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope,
    }).then(function (popover) {
      $scope.popover = popover;
    });

    // --------------- PERFIL PROFESOR ---------------//  
    $scope.seleccionaProfesor = function () {
      console.log("Selecciona profesor")
      $localstorage.set("atleta", false)
      //$scope.perfil = "profesor";
      vm.textoPerfil = 'Entrenamientos enviados'
      activarProfesor()
      $scope.popover.hide()
      console.log("ls: " + $localstorage.get("atleta"))
      vm.esAtleta = $localstorage.get("atleta")
      //$scope.elPerfil = 'profesor'
    }

    // --------------- PERFIL ATLETA ---------------//
    $scope.seleccionaAtleta = function () {
      //$scope.elPerfil = 'atleta'
      console.log("Selecciona atleta")
      $localstorage.set("atleta", true)
      //$scope.perfil = "atletaaaa";
      vm.textoPerfil = 'Entrenamientos recibidos'
      //      activarAtleta()
      $scope.popover.hide()
      console.log("ls: " + $localstorage.get("atleta"))
      vm.esAtleta = $localstorage.get("atleta")
    }

    // Obtengo el día en la semana donde me ubico
    vm.fecha = new Date();  // por defecto el día calendario donde me encuentro

    switch (vm.fecha.getDay()) {
      case 0: // Domingo
        vm.diasC = new Array('J', 'V', 'S', 'D', 'L', 'M', 'X')
        break;
      case 1: // Lunes
        vm.diasC = new Array('V', 'S', 'D', 'L', 'M', 'X', 'J')
        break;
      case 2: // Martes
        vm.diasC = new Array('S', 'D', 'L', 'M', 'X', 'J', 'V')
        break;
      case 3: // Miércoles
        vm.diasC = new Array('D', 'L', 'M', 'X', 'J', 'V', 'S')
        break;
      case 4: // Jueves
        vm.diasC = new Array('L', 'M', 'X', 'J', 'V', 'S', 'D')
        break;
      case 5: // Viernes
        vm.diasC = new Array('M', 'X', 'J', 'V', 'S', 'D', 'L')
        break;
      case 6: // Sábado
        vm.diasC = new Array('X', 'J', 'V', 'S', 'D', 'L', 'M')
        break;
    }

    vm.dia1 = vm.diasC[0]
    vm.dia2 = vm.diasC[1]
    vm.dia3 = vm.diasC[2]
    vm.dia4 = vm.diasC[3]
    vm.dia5 = vm.diasC[4]
    vm.dia6 = vm.diasC[5]
    vm.dia7 = vm.diasC[6]

    resolverFecha(vm, vm.dia4)

    console.log(vm.diasC);
    vm.seleccionado = vm.diasC[3]

    $scope.seleccionarDia = function (diaSelected) {
      dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
      dia = dias.indexOf(diaSelected);

      switch (dia) {
        case 0: // Domingo
          vm.seleccionado = 'D';
          break;
        case 1: // Lunes
          vm.seleccionado = 'L';
          break;
        case 2: // Martes
          vm.seleccionado = 'M';
          break;
        case 3: // Miércoles
          vm.seleccionado = 'X';
          break;
        case 4: // Jueves
          vm.seleccionado = 'J';
          break;
        case 5: // Viernes
          vm.seleccionado = 'V';
          break;
        case 6: // Sábado
          vm.seleccionado = 'S';
          break;
      }
      resolverFecha(vm, diaSelected)
      if ($localstorage.get("atleta")=='true') {
        activarAtleta()
      } else {
        activarProfesor()
      }
    }
    console.log("$localstorage "+$localstorage.get("atleta"))
    if ($localstorage.get("atleta")=='true') {
      activarAtleta()
    } else {
      activarProfesor()
    }

    // Esta funcion carga la lista de entrenamientos enviados por un profesor
    function activarProfesor() {
      console.log('activarProfesor');
      $ionicLoading.show({
        template: 'Cargando'
      })

      $ionicScrollDelegate.scrollTop()
      var atletas = []
     // $scope.elPerfil = 'profesor'

      // se conecta a la API y obtiene el atleta
      $http.get('https://hectorapi.herokuapp.com/api/profesor/entrenamientos/' + vm.fechaJSON + '?token=' + token)
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          console.log('data success - entrenamientos por profe y fecha');
          console.log(JSON.stringify(data));

          vm.entrenamientosP = data;

        })
        .error(function (data, status, headers, config) {
          $ionicLoading.hide();
          alert(data);
          console.log(JSON.stringify(data))
        })
    };


    //--- 

    // esta funcion se usa para el refresh
    $scope.refresh = function () {
      activar()
    };
    //---       

    $scope.nuevoEntrenamiento = function () {
      $state.go('tab.nuevoEntrenamiento')
    }

    // Esta funcion carga la lista de entrenamientos recibidos por el atleta
    function activarAtleta() {
      
      console.log('activarAtleta');
      $ionicLoading.show({
        template: 'Cargando'
      })

      $ionicScrollDelegate.scrollTop()

      // se conecta a la API y obtiene el atleta
      $http.get('https://hectorapi.herokuapp.com/api/atleta/entrenamientos/' + vm.fechaJSON + '?token=' + token)
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          console.log('data success - entrenamientos por atleta y fecha');
          console.log(JSON.stringify(data));

          vm.entrenamientosA = data;

        })
        .error(function (data, status, headers, config) {
          $ionicLoading.hide();
          alert(data);
          console.log(JSON.stringify(data))
        })

    };

  })

  .controller('NuevoEntrenamientoCtrl', function ($state, $scope, $http, $localstorage) {

    console.log('NuevoEntrenamientoCtrl')
    var vm = this;
    vm.ejercicios = [];
    vm.nombreEntrenamiento = '';
    var token = $localstorage.get("access_token")

    // Agregar un ejercicio al string de ejercicios
    $scope.agregar = function () {
      // Lo agrego al array para verlo en pantalla
      vm.ejercicios.push(vm.nuevoEjercicio)
      vm.nuevoEjercicio = '';
      console.log('NuevoEntrenamientoCtrl agregar: ' + vm.ejercicios)
    }

    $scope.enviar = function () {
      // ejercicios
      var listaEjercicios = vm.ejercicios
      // nombre
      var nombreEntrenamiento = vm.nombreEntrenamiento
      // el profesor es el que está logueado

      console.log('listaEjercicios: ' + vm.ejercicios)
      console.log('nombreEntrenamiento: ' + vm.nombreEntrenamiento)

      if (vm.ejercicios != [] && vm.nombreEntrenamiento != '') {
        console.log(' Da de alta nuevo entrenamiento')

        // Al confirmar tengo que crear la rutina asociada al profesor (nombre/profesor/lista de ejercicios)
        var header = { headers: { 'Content-Type': 'application/json' } }
        var body = JSON.stringify({
          nombre: vm.nombreEntrenamiento,
          ejercicios: vm.ejercicios
        });
        $http.post('https://hectorapi.herokuapp.com/api/rutinas' + '?token=' + token, body, header)
          .success(function (data, status, headers, config) {
            console.log('data success - Nueva rutina');
            console.log(JSON.stringify(data)); // for browser console
            // Navego a una nueva ventana        
            $state.go('tab.enviarEntrenamiento', { idRutina: data._id })
            //$scope.ejercicios = data[0].ejercicios;                  
          })
          .error(function (data, status, headers, config) {
            alert("Error al conectarse al servidor!")
            console.log('data error ' + data);
          })
      }
    }
  })

  .controller('enviarEntrenamientoCtrl', function ($scope, $ionicHistory, $localstorage, $http, $stateParams, $state, $ionicPopup, $ionicLoading) {
    console.log('>>enviarEntrenamientoCtrl');
    var token = $localstorage.get("access_token")
    var vm = this;
    vm.idRutina = $stateParams.idRutina;
    console.log("Idrutina recibido: " + $stateParams.idRutina)

    // -- Obtengo nombre de atletas
    $scope.buscarAtleta = function () {
      console.log(vm.atletaBuscar)
      vm.encontrado = false;

      // se conecta a la API y obtiene el atleta
      $http.get('https://hectorapi.herokuapp.com/api/usuarios/' + vm.atletaBuscar + '?token=' + token)
        .success(function (data, status, headers, config) {
          console.log('data success - Buscar atleta');
          console.log(JSON.stringify(data));
          if (data != null) {
            vm.atletaSeleccionado = data;
            vm.encontrado = true;
          } else {
            var alertPopup = $ionicPopup.alert({
              title: 'Upps!',
              template: 'El nombre seleccionado no existe, intenta con otro'
            });
          }
        })
        .error(function (data, status, headers, config) {
          alert(data);
          console.log(JSON.stringify(data))
        })
    }

    $scope.continuar = function () {

      $ionicLoading.show({
        template: 'Procesando'
      })

      console.log('fecha continuar: ' + vm.fecha)
      console.log('atleta continuar: ' + JSON.stringify(vm.atletaSeleccionado))

      var mes = vm.fecha.getMonth() + 1
      if (mes < 10) { mes = '0' + mes }

      var dia = vm.fecha.getDate()
      if (dia < 10) { dia = '0' + dia }

      var fecha = vm.fecha.getFullYear() + '-' + mes + '-' + dia;
      var ejerciciosAtleta = [];
      // a partir del id de rutina recibido obtengo los ejercicios
      $http.get('https://hectorapi.herokuapp.com/api/rutinas/' + vm.idRutina + '?token=' + token)
        .success(function (data, status, headers, config) {
          console.log('data success get rutina Nuevo entrenamiento');
          console.log(JSON.stringify(data)); // for browser console
          ejerciciosAtleta = data.ejercicios;

          // Al confirmar tengo que crear el entrenamiento asociado al profesor que lo creó y el atleta al que se le va a enviar
          console.log("atletaseleccionado: " + vm.atletaSeleccionado._id)
          console.log("Ejercicios: " + ejerciciosAtleta)
          var header = { headers: { 'Content-Type': 'application/json' } }
          var body = JSON.stringify({
            fecha: fecha,
            atletaId: vm.atletaSeleccionado._id,
            ejercicios: ejerciciosAtleta
          });
          $http.post('https://hectorapi.herokuapp.com/api/entrenamientos' + '?token=' + token, body, header)
            .success(function (data1, status, headers, config) {
              console.log('data success Nuevo entrenamiento');
              console.log(JSON.stringify(data1)); // for browser console

              success();
            })
            .error(function (data1, status, headers, config) {
              alert(data1)
              $ionicLoading.hide();
              console.log('data error ' + JSON.stringify(data));
            })
        })
        .error(function (data, status, headers, config) {
          alert('Error del servidor')
          console.log('data error ' + data);
        })
    };

    // Muestro confirmacion
    function success() {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Éxito!',
        template: 'Entrenamiento enviado'
      });

      alertPopup.then(function (res) {
        $ionicHistory.clearHistory()
        $state.go('tab.calendario')
      });
    };

  })

  .controller('EntrenamientoDetalleCtrl', function ($state, $stateParams, $ionicLoading, $localstorage, $scope, $ionicScrollDelegate, $http) {

    console.log('EntrenamientoDetalleCtrl')
    var entrenamientoId = $stateParams.entrenamientoId;
    var atletaId = $stateParams.atletaId;
    var fecha = $stateParams.fecha;
    var token = $localstorage.get("access_token")

    activar()

    // funcion que carga la lista de entrenamientos de un atleta
    function activar() {

      $ionicLoading.show({
        template: 'Cargando'
      })
      $ionicScrollDelegate.scrollTop()
      var atletas = []

      // se conecta a la API y obtiene el atleta
      $http.get('https://hectorapi.herokuapp.com/api/entrenamientos/' + entrenamientoId + '?token=' + token)
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          console.log('data success - entrenamientos por id');
          console.log(JSON.stringify(data));
          $scope.ejercicios = data.ejercicios;

        })
        .error(function (data, status, headers, config) {
          $ionicLoading.hide();
          alert(data);
          console.log(JSON.stringify(data))
        })
    };

    // Agregar un ejercicio al string de ejercicios
    $scope.agregar = function () {
      // Lo agrego al array para verlo en pantalla
      $scope.ejercicios.push($scope.nuevoEjercicio)
      console.log('NuevoEntrenamientoCtrl agregar: ' + $scope.ejercicios)
      /*
      // creo la rutina
      var header = { headers: { 'Content-Type': 'application/json' } }
      var body = JSON.stringify({
        nombre: vm.nombreEntrenamiento,
        ejercicios: vm.ejercicios
      });
      $http.post('https://hectorapi.herokuapp.com/api/rutinas' + '?token=' + token, body, header)
        .success(function (data, status, headers, config) {
          console.log('data success - Nueva rutina');
          console.log(JSON.stringify(data)); // for browser console
          // Navego a una nueva ventana        
          $state.go('tab.enviarEntrenamiento', { idRutina: data._id })
          //$scope.ejercicios = data[0].ejercicios;                  
        })
        .error(function (data, status, headers, config) {
          alert("Error al conectarse al servidor!")
          console.log('data error ' + data);
        })*/

      // modifico el entrenamiento
      var header = { headers: { 'Content-Type': 'application/json' } }
      var body = JSON.stringify({
        fecha: fecha,
        atletaId: atletaId,
        ejercicios: $scope.ejercicios
      });
      $http.put('https://hectorapi.herokuapp.com/api/entrenamientos/' + entrenamientoId + '?token=' + token, body, header)
        .success(function (data, status, headers, config) {
          console.log('data success Nuevo entrenamiento');
          console.log(JSON.stringify(data)); // for browser console
          $scope.nuevoEjercicio = '';
        })
        .error(function (data, status, headers, config) {
          alert(data.message)
          console.log('data error ' + JSON.stringify(data));
        })
    };

  })

  .controller('RutinaDetalleCtrl', function ($state, $stateParams, $ionicLoading, $localstorage, $scope, $ionicScrollDelegate, $http) {

    console.log('RutinaDetalleCtrl')
    var rutinaId = $stateParams.rutinaId;
    var token = $localstorage.get("access_token")

    activar()

    // funcion que carga la lista de entrenamientos de un atleta
    function activar() {

      $ionicLoading.show({
        template: 'Cargando'
      })
      $ionicScrollDelegate.scrollTop()

      $ionicLoading.hide();
      console.log("IdRutina: " + rutinaId)

      // se conecta a la API y obtiene el atleta
      $http.get('https://hectorapi.herokuapp.com/api/rutinas/' + rutinaId + '?token=' + token)
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          console.log('data success - rutinas por id');
          console.log(JSON.stringify(data));
          //$scope.ejercicios = data.ejercicios;

        })
        .error(function (data, status, headers, config) {
          $ionicLoading.hide();
          alert(data);
          console.log(JSON.stringify(data))
        })
    };
  })

  .controller('RutinasCtrl', function ($state, $rootScope, $ionicHistory, $ionicLoading, $http, $localstorage, $log, $scope, Rutinas, $ionicScrollDelegate) {
    console.log(">>>RutinasCtrl")

    var vm = this;
    var token = $localstorage.get("access_token")

    activar()

    // funcion que carga la lista de entrenamientos de un atleta
    function activar() {

      $ionicLoading.show({
        template: 'Cargando'
      })
      $ionicScrollDelegate.scrollTop()
      var atletas = []

      // se conecta a la API y obtiene el atleta
      $http.get('https://hectorapi.herokuapp.com/api/profesor/rutinas' + '?token=' + token)
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          console.log('data success - rutinas por profe');
          console.log(JSON.stringify(data));
          vm.rutinas = data;

        })
        .error(function (data, status, headers, config) {
          $ionicLoading.hide();
          alert(data);
          console.log(JSON.stringify(data))
        })
    };

    // esta funcion se usa para el refresh
    $scope.refresh = function () {
      activar()
    };
    //---    

    $scope.cambiarPerfil = function () {

      console.log("funcion cambiar perfil: " + $localstorage.get("atleta"))
      if ($localstorage.get("atleta") === "true") {
        console.log("es atleta")
        $localstorage.set("atleta", false)

        $rootScope.sampleStatus = $localstorage.get("atleta");

      } else {
        console.log("no es atleta")
        $localstorage.set("atleta", true)

        $rootScope.sampleStatus = $localstorage.get("atleta");
      }
    }

  })


  .controller('tabController', function ($scope, $rootScope, $localstorage) {

    $localstorage.set("atleta", false)
    $scope.atleta = false;
    /*
    $scope.atleta = $localstorage.get("atleta");

    $rootScope.$watch('sampleStatus', function (status) {
      $scope.atleta = $localstorage.get("atleta");
    })*/

    console.log("en TabController es atleta: " + $scope.atleta);
  })

  .controller('DashCtrl', function ($scope) { })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope, $localstorage, $ionicLoading, $http, $rootScope) {

    console.log(">>>AccountCtrl")
    var vm = this;
    var token = $localstorage.get("access_token")
    console.log("get: " + $localstorage.get("atleta"))

    if ($localstorage.get("atleta") === "true") {
      console.log("es atleta")
      vm.radioperfil = 'Atleta'
    } else {
      console.log("no es atleta")
      vm.radioperfil = 'Profesor'
    }

    $ionicLoading.show({
      template: 'Procesando'
    })
    // se conecta a la API y obtiene el atleta
    $http.get('https://hectorapi.herokuapp.com/api/yo' + '?token=' + token)
      .success(function (data, status, headers, config) {
        $ionicLoading.hide();
        console.log('data success - perfil de usuario');
        console.log(JSON.stringify(data));
        vm.user = data.nombre;

      })
      .error(function (data, status, headers, config) {
        $ionicLoading.hide();
        alert(data);
        console.log(JSON.stringify(data))
      })

    $scope.cambiarPerfil = function (perfil) {
      console.log("PerfilChange: " + perfil)
      if (perfil == 'Atleta') {
        $localstorage.set("atleta", true)
      } else {
        $localstorage.set("atleta", false)
      }
      $rootScope.sampleStatus = $localstorage.get("atleta");
    }

    $scope.cambiarPerfil1 = function () {
      console.log("funcion cambiar perfil: " + $localstorage.get("atleta"))
      if ($localstorage.get("atleta") === "true") {
        console.log("es atleta")
        $localstorage.set("atleta", false)

        $rootScope.sampleStatus = $localstorage.get("atleta");

      } else {
        console.log("no es atleta")
        $localstorage.set("atleta", true)

        $rootScope.sampleStatus = $localstorage.get("atleta");
      }
    }

    $scope.settings = {
      //      enableFriends: true
    };
  });

function resolverFecha(vm, diaSelected) {

  fechaSeleccionada = new Date(vm.fecha)
  console.log(diaSelected)
  switch (diaSelected) {
    case vm.dia1:
      fechaS = new Date(fechaSeleccionada.setDate(vm.fecha.getDate() - 3));
      break;
    case vm.dia2:
      fechaS = new Date(fechaSeleccionada.setDate(vm.fecha.getDate() - 2));
      break;
    case vm.dia3:
      fechaS = new Date(fechaSeleccionada.setDate(vm.fecha.getDate() - 1));
      break;
    case vm.dia4:
      fechaS = new Date(fechaSeleccionada.setDate(vm.fecha.getDate()));
      break;
    case vm.dia5:
      fechaS = new Date(fechaSeleccionada.setDate(vm.fecha.getDate() + 1));
      break;
    case vm.dia6:
      fechaS = new Date(fechaSeleccionada.setDate(vm.fecha.getDate() + 2));
      break;
    case vm.dia7:
      fechaS = new Date(fechaSeleccionada.setDate(vm.fecha.getDate() + 3));
      break;
  }

  console.log("Fecha: " + fechaS)

  // Convierto formato
  var mes = fechaS.getMonth() + 1
  if (mes < 10) { mes = '0' + mes }
  var dia = fechaSeleccionada.getDate()
  if (dia < 10) { dia = '0' + dia }

  vm.fechaJSON = fechaS.getFullYear() + '-' + mes + '-' + dia;
  console.log(vm.fechaJSON)
}
