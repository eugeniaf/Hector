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
            if ($localstorage.get("atleta")) {
              //$state.go('tab.entrenamientoAtleta')
              $state.go('tab.calendarioProfe')
            }
            else {
              $state.go('tab.calendarioProfe')
            }
          });
        };
      });
      //$state.go('tab.calendarioProfe')
    };
    //---        
  })

  .controller('RegistroCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, $localstorage) {
    // se crea la estructura user, luego aquí se reciben el usuario y la contraseña
    $scope.user = {}

    $localstorage.set("access_token", null)
    $localstorage.set("atleta", true)

    // función que se ejecuta al presionar el boton Entrar, valida que las credenciales del usuario sean correctas
    $scope.registrarse = function () {

      $ionicHistory.clearHistory()
      $ionicHistory.clearCache().then(function () {
        $state.go('tab.rutinas')
      });
    };
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
    diaSemana($scope);

  })

  .controller('CalendarioProfeCtrl', function ($ionicLoading, $ionicPopup, $http, $state, $rootScope, $localstorage, $log, $scope, Entrenamientos, $ionicScrollDelegate) {

    console.log("CalendarioProfeCtrl")
    var token = $localstorage.get("access_token")
    $scope.atletaId = 0;

    // Obtengo el día en la semana donde me ubico
    $scope.fecha = new Date();  // por defecto el día calendario donde me encuentro
    
    switch ($scope.fecha.getDay()) {
      case 0: // Domingo
        $scope.diasC = new Array('J', 'V', 'S', 'D', 'L', 'M', 'X')
        break;
      case 1: // Lunes
        $scope.diasC = new Array('V', 'S', 'D', 'L', 'M', 'X', 'J')
        break;
      case 2: // Martes
        $scope.diasC = new Array('S', 'D', 'L', 'M', 'X', 'J', 'V')
        break;
      case 3: // Miércoles
        $scope.diasC = new Array('D', 'L', 'M', 'X', 'J', 'V', 'S')
        break;
      case 4: // Jueves
        $scope.diasC = new Array('L', 'M', 'X', 'J', 'V', 'S', 'D')
        break;
      case 5: // Viernes
        $scope.diasC = new Array('M', 'X', 'J', 'V', 'S', 'D', 'L')
        break;
      case 6: // Sábado
        $scope.diasC = new Array('X', 'J', 'V', 'S', 'D', 'L', 'M')
        break;
    }

    $scope.dia1 = $scope.diasC[0]
    $scope.dia2 = $scope.diasC[1]
    $scope.dia3 = $scope.diasC[2]
    $scope.dia4 = $scope.diasC[3]
    $scope.dia5 = $scope.diasC[4]
    $scope.dia6 = $scope.diasC[5]
    $scope.dia7 = $scope.diasC[6]
    
    resolverFecha($scope, $scope.dia4)

    console.log($scope.diasC);
    console.log('Dia hoy: ' + $scope.fecha.getDay())
    $scope.seleccionado = $scope.diasC[3]

    $scope.seleccionarDia = function (diaSelected) {

      dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
      dia = dias.indexOf(diaSelected);

      switch (dia) {
        case 0: // Domingo
          $scope.seleccionado = 'D';
          break;
        case 1: // Lunes
          $scope.seleccionado = 'L';
          break;
        case 2: // Martes
          $scope.seleccionado = 'M';
          break;
        case 3: // Miércoles
          $scope.seleccionado = 'X';
          break;
        case 4: // Jueves
          $scope.seleccionado = 'J';
          break;
        case 5: // Viernes
          $scope.seleccionado = 'V';
          break;
        case 6: // Sábado
          $scope.seleccionado = 'S';
          break;
      }

      resolverFecha($scope, diaSelected)
      activar()
    }

    activar()

    // esta funcion carga la lista de rutinas
    function activar() {
      $ionicLoading.show({
        template: 'Cargando'
      })
      $ionicScrollDelegate.scrollTop()
      var atletas = []

      // se conecta a la API y obtiene el atleta
      $http.get('https://hectorapi.herokuapp.com/api/profesor/entrenamientos/' + $scope.fechaJSON + '?token=' + token)
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          console.log('data success - entrenamientos por profe y fecha');
          console.log(JSON.stringify(data));

          // Con el atletaId obtengo el nombre
          for (var x in data) {
            atletas.push(data[x].atletaId);
            console.log(data[x].atletaId);
          }

        })
        .error(function (data, status, headers, config) {
          $ionicLoading.hide();
          alert(data);
          console.log(JSON.stringify(data))
        })
        .then(function (resp) {
          /*
          for(var i in atletas){
            // se conecta a la API y obtiene el atleta
            $http.get('https://hectorapi.herokuapp.com/api/profesor/entrenamientos/'+ $scope.fechaJSON + '?token=' + token)
              .success(function (data, status, headers, config) {
                $ionicLoading.hide();
                console.log('data success - entrenamientos por profe y fecha');
                console.log(JSON.stringify(data));

                // Con el atletaId obtengo el nombre
                
                { 
                  atletas.push(data[x].atletaId);
                  console.log(data[x].atletaId);
                }
                      $scope.entrenamientos = atletas;
                
              })
              .error(function (data, status, headers, config) {
                $ionicLoading.hide();
                alert(data.message);
                console.log(JSON.stringify(data))
              })          
          }*/
          $scope.entrenamientos = atletas;
        })
    };
    //--- 

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

    $scope.nuevoEntrenamiento = function () {
      $state.go('tab.nuevoEntrenamiento')
    }

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
        /*
                  .then(function (resp) {
                    console.log('Then rutinas ' + JSON.stringify(resp));
                  })*/

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
      //$scope.atletaSeleccionado = 
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
          alert(data.message);
        })
      /*
    .then(function (resp) {
      console.log('Then buscar atleta ' + JSON.stringify(resp));
    })  */
    }

    $scope.continuar = function () {

      $ionicLoading.show({
        template: 'Procesando'
      })

      console.log('fecha continuar: ' + vm.fecha) // cambiar formato fecha 
      console.log('atleta continuar: ' + JSON.stringify(vm.atletaSeleccionado))

      var mes = vm.fecha.getMonth() + 1
      if (mes < 10) { mes = '0' + mes }

      var dia = vm.fecha.getDate()
      if (dia < 10) { dia = '0' + dia }

      var fecha = vm.fecha.getFullYear() + '-' + mes + '-' + dia;
      console.log('Fecha pasada: ' + vm.fecha.getFullYear() + '-' + mes + '-' + dia);

      var ejercicios = [];
      /*
      // a partir del id de rutina recibido obtengo los ejercicios
        $http.get('https://hectorapi.herokuapp.com/api/rutinas/' + vm.idRutina + '?token=' + token)
          .success(function (data, status, headers, config) {
            console.log('data success get rutina Nuevo entrenamiento');
            console.log(JSON.stringify(data)); // for browser console
            
          })
          .error(function (data, status, headers, config) {
            alert('Error del servidor')
            console.log('data error ' + data);
          })
          */


      // Al confirmar tengo que crear el entrenamiento asociado al profesor que lo creó y el atleta al que se le va a enviar

      console.log("atletaseleccionado: " + vm.atletaSeleccionado._id)

      var header = { headers: { 'Content-Type': 'application/json' } }
      var body = JSON.stringify({
        fecha: fecha,
        atletaId: vm.atletaSeleccionado._id,
        ejercicios: ['d', 'e', 'f', 'g']
      });
      $http.post('https://hectorapi.herokuapp.com/api/entrenamientos' + '?token=' + token, body, header)
        .success(function (data, status, headers, config) {
          console.log('data success Nuevo entrenamiento');
          console.log(JSON.stringify(data)); // for browser console

          success();
        })
        .error(function (data, status, headers, config) {
          alert(data.message)
          console.log('data error ' + JSON.stringify(data));
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
        $state.go('tab.calendarioProfe')
      });
    };

  })

  .controller('EntrenamientoDetalleCtrl', function ($state, $stateParams, Ejercicios, $scope, $ionicModal) {

    console.log('EntrenamientoDetalleCtrl')
    /*
        // Load the add / change dialog from the given template URL
        $ionicModal.fromTemplateUrl('templates/agregarEjercicioDialog.html', function (modal) {
          $scope.addDialog = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
          });
    
        $scope.showAddChangeDialog = function (action) {
          $scope.action = action;
          $scope.addDialog.show();
        };
    
        $scope.leaveAddChangeDialog = function () {
          // Remove dialog 
          $scope.addDialog.remove();
          // Reload modal template to have cleared form
          $ionicModal.fromTemplateUrl('add-change-dialog.html', function (modal) {
            $scope.addDialog = modal;
          }, {
              scope: $scope,
              animation: 'slide-in-up'
            });
        };
        $scope.nuevo = function () {
          $scope.showAddChangeDialog('add');
        }
        // Define item buttons
        $scope.itemButtons = [{
          text: 'Delete',
          type: 'button-assertive',
          onTap: function (item) {
            $scope.removeItem(item);
          }
        }, {
            text: 'Edit',
            type: 'button-calm',
            onTap: function (item) {
              $scope.showEditItem(item);
            }
          }];
    
        $scope.addItem = function (form) {
          var newItem = {};
          // Add values from form to object
          newItem.description = form.description.$modelValue;
          newItem.useAsDefault = form.useAsDefault.$modelValue;
          // If this is the first item it will be the default item
          if ($scope.list.length == 0) {
            newItem.useAsDefault = true;
          } else {
            // Remove old default entry from list	
            if (newItem.useAsDefault) {
              removeDefault();
            }
          }
          // Save new list in scope and factory
          $scope.list.push(newItem);
          ListFactory.setList($scope.list);
          // Close dialog
          $scope.leaveAddChangeDialog();
        };*/

    var atletaId = 0;//$stateParams.atletaId;
    //console.log('$stateParams.atletaId: ', $stateParams.atletaId);
    // console.log('Entrenamientos: ', JSON.stringify(Entrenamientos.all()));

    activar()
    console.log(JSON.stringify(Ejercicios.all()))
    // funcion que carga la lista de entrenamientos de un atleta
    function activar() {
      //  console.log("CLOG" + JSON.stringify(Entrenamientos.get(/*atletaId*/0)));
      $scope.ejercicios = Ejercicios.all(); //Entrenamientos.get(/*atletaId*/0);
    };

  })

  .controller('RutinasCtrl', function ($state, $rootScope, $ionicHistory, $localstorage, $log, $scope, Rutinas, $ionicScrollDelegate) {
    console.log(">>>RutinasCtrl")

    var vm = this;
    activar()

    //console.log("Rutinas " + JSON.stringify(Rutinas.all()[1]))


    // esta funcion carga la lista de rutinas
    function activar() {
      $ionicScrollDelegate.scrollTop()
      $scope.rutinas = Rutinas.all();
      $scope.remove = function (rutina) {
        Rutinas.remove(rutina);
      };
    };
    //--- 

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
    $scope.atleta = $localstorage.get("atleta");

    $rootScope.$watch('sampleStatus', function () {
      $scope.atleta = $localstorage.get("atleta");
      console.log("tabController: $scope.atleta " + $scope.atleta)
    })
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

  .controller('AccountCtrl', function ($scope) {

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

    console.log(">>>AccountCtrl")
    $scope.settings = {
      enableFriends: true
    };
  });

function resolverFecha($scope, diaSelected) {
  
  fechaSeleccionada = new Date($scope.fecha)
  console.log(diaSelected)
  switch (diaSelected) {
    case $scope.dia1:
      fechaS = new Date(fechaSeleccionada.setDate($scope.fecha.getDate() - 3));
      break;
    case $scope.dia2:
      fechaS = new Date(fechaSeleccionada.setDate($scope.fecha.getDate() - 2));      
      break;
    case $scope.dia3:
      fechaS = new Date(fechaSeleccionada.setDate($scope.fecha.getDate() - 1));
      break;
    case $scope.dia4:
      fechaS = new Date(fechaSeleccionada.setDate($scope.fecha.getDate()));
      break;      
    case $scope.dia5:
      fechaS = new Date(fechaSeleccionada.setDate($scope.fecha.getDate() + 1));
      break;
    case $scope.dia6:
      fechaS = new Date(fechaSeleccionada.setDate($scope.fecha.getDate() + 2));
      break;
    case $scope.dia7:
      fechaS = new Date(fechaSeleccionada.setDate($scope.fecha.getDate() + 3));
      break;
  }
  
  console.log("Fecha: " + fechaS)

  // Convierto formato
  var mes = fechaS.getMonth() + 1
  if (mes < 10) { mes = '0' + mes }
  var dia = fechaSeleccionada.getDate()
  if (dia < 10) { dia = '0' + dia }

  $scope.fechaJSON = fechaS.getFullYear() + '-' + mes + '-' + dia;
  console.log($scope.fechaJSON)
}
