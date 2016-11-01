angular.module('starter.controllers', [])

  //***** CONTROLADOR LOGIN
  //************************************************
  .controller('LoginCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, $localstorage) {

    // se crea la estructura user, luego aquí se reciben el usuario y la contraseña
    $scope.user = {}

    $localstorage.set("access_token", null)
    $localstorage.set("atleta", true)

    // función que se ejecuta al presionar el boton Entrar, valida que las credenciales del usuario sean correctas
    $scope.signIn = function () {

      $ionicHistory.clearHistory()
      $ionicHistory.clearCache().then(function () {
        $state.go('tab.rutinas')
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
    

    $scope.dia = '';

    $scope.domingo = function () {
      $scope.dia = 'D';
      //console.log("domingo");
    };

    $scope.lunes = function () {
      $scope.dia = 'L';
      //console.log("lunes");
    };

    $scope.martes = function () {
      $scope.dia = 'M';
      //console.log("martes");
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

  })
  
.controller('CalendarioProfeCtrl', function ($ionicLoading, $rootScope, $localstorage, $log, $scope, Entrenamientos, $ionicScrollDelegate) {

    console.log("CalendarioProfeCtrl")
    
    activar()

    // esta funcion carga la lista de rutinas
    function activar() {
      $ionicScrollDelegate.scrollTop()
      $scope.entrenamientos = Entrenamientos.all();
      $scope.remove = function (entrenamiento) {
        Entrenamientos.remove(entrenamiento);
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
    

    $scope.dia = '';

    $scope.domingo = function () {
      $scope.dia = 'D';
      //console.log("domingo");
    };

    $scope.lunes = function () {
      $scope.dia = 'L';
      //console.log("lunes");
    };

    $scope.martes = function () {
      $scope.dia = 'M';
      //console.log("martes");
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

  .controller('NuevaRutinaCtrl', function ($scope) {

  })


  .controller('tabController', function ($scope, $rootScope, $localstorage) {
    $scope.atleta = $localstorage.get("atleta");

    $rootScope.$watch('sampleStatus', function () {
      $scope.atleta = $localstorage.get("atleta");
      console.log("tabController: $scope.atleta " + $scope.atleta)
    })

    
    console.log("en TabController es atleta: " + $scope.atleta);
    
    /*
    $scope.mostrar = false;
    $scope.tabs = [
      {
        'title': 'Mis rutinas',
        'href': '#/tab/rutinas',
        'name': 'tab-rutinas'
      }, {
        'title': 'Calendario',
        'href': '#/tab/calendario',
        'name': 'tab-calendario'
      }]*/
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
