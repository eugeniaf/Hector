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
                    $ionicHistory.clearCache().then(function(){
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
    diaSemana($scope);

  })

  .controller('CalendarioProfeCtrl', function ($ionicLoading, $http, $state, $rootScope, $localstorage, $log, $scope, Entrenamientos, $ionicScrollDelegate) {

    console.log("CalendarioProfeCtrl")
    $scope.atletaId = 0;
    
    // Obtengo el día en la semana donde me ubico
    diaSemana($scope);

    activar()

    // esta funcion carga la lista de rutinas
    function activar() {
     /* $ionicLoading.show({
          template: 'Cargando'
      })*/
      $ionicScrollDelegate.scrollTop()
           
      // ejecuta servicio
      var config = {headers: 
                    {'x-access-token': $localstorage.get("access_token")}
                  }
      $http.get('https://hectorapi.herokuapp.com/api/yo',config).then(function(resp){
        console.log('Success', resp.data); // JSON object
      }, function(err){
        console.error('ERR', err);
      })      
          
      /*
      $sails.get('/reporte/obtenerDeAlumno?alumnoId='+$stateParams.alumnoId)
      .success(function (data, status, headers, jwr) {
          $scope.entrenamientos = data
          console.log(JSON.stringify($scope.entrenamientos))
          $ionicLoading.hide();
      })
      .error(function (data, status, headers, jwr) {
          $ionicLoading.hide();
      });*/       
      
      
      //$scope.entrenamientos = Entrenamientos.getFecha($scope.fecha, 'Carlos');
      /*
      console.log(JSON.stringify($scope.entrenamientos))
      $scope.remove = function (entrenamiento) {
        Entrenamientos.remove(entrenamiento);
      };*/
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
    
    $scope.mostrarListaEjercicios = false;
    $scope.ejercicios = [];
    
    console.log('NuevoEntrenamientoCtrl')
    console.log($scope.mostrarListaEjercicios)
    
    $scope.continuar = function () {
      /*
      console.log('fecha continuar: ' + $scope.form.descripcion)
      console.log('mensaje: ' + $scope.form.mensaje)
      console.log('descripcion continuar: ' + $scope.form.fecha)*/
      
      $scope.mostrarListaEjercicios = true;
      console.log($scope.mostrarListaEjercicios)
      
      var atletaId = 0;//$stateParams.atletaId;
      activar()
      
      // funcion que carga la lista de entrenamientos 
      function activar() {
      //  $scope.ejercicios = Ejercicios.all(); //Entrenamientos.get(/*atletaId*/0);

            // se conecta a la API y obtiene la lista de ejercicios de un profesor
            var token = $localstorage.get("access_token")
            var fecha = '2016-10-03' //$scope.fecha
            console.log('Fecha: ' + fecha)
            $http.get('https://hectorapi.herokuapp.com/api/atleta/entrenamientos/' + fecha + '?token=' + token)
              .success(function(data, status, headers,config){
                  console.log('data success');
                  console.log(data); // for browser console
                  //if(resp.data){
                    //$scope.ejercicios = resp.data[0].ejercicios;    
                  //}              
                  //console.log(' > ejercicios', $resp.data[0]);
                })
              .error(function(data, status, headers,config){
                alert("Error al conectarse al servidor!")
                console.log('data error '+ data);
              })
              .then(function(resp){
console.log('no se que es esto '+ JSON.stringify(resp));
              })
              
            /*
            $http.get('https://hectorapi.herokuapp.com/api/profesor/entrenamientos/' + fecha + '?token=' + token)
              .then(function(resp){
                console.log('Success ejercicios', JSON.stringify(resp.data)); // JSON object 
                //if(resp.data){
                  //$scope.ejercicios = resp.data[0].ejercicios;    
                //}              
                console.log(' > ejercicios', $resp.data[0]);
              }, function(err){
                alert("Error al conectarse al servidor!")
                console.error('ERR', err);
              })*/      
      };    
      
      // Agregar un ejercicio al string de ejercicios
      function agregar(){
          $scope.ejercicios.push('5')
      } 
       
    }
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

function diaSemana($scope) {
  
  // -- Obtengo el día de la semana donde me ubico
  $scope.fecha = new Date();
  
  dias = new Array('D', 'L', 'M', 'X', 'J', 'V', 'S')
  $scope.dia = dias[$scope.fecha.getDay()]
  
  $scope.fecha = '2016-11-09' //new Date();

  $scope.domingo = function () {
    $scope.dia = 'D';
  };

  $scope.lunes = function () {
    $scope.dia = 'L';
  };

  $scope.martes = function () {
    $scope.dia = 'M';
  };

  $scope.miercoles = function () {
    $scope.dia = 'X';
  };

  $scope.jueves = function () {
    $scope.dia = 'J';
  };

  $scope.viernes = function () {
    $scope.dia = 'V';
  };

  $scope.sabado = function () {
    $scope.dia = 'S';
  };
  
}
