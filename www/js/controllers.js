angular.module('starter.controllers', [])

  //***** CONTROLADOR LOGIN
  //************************************************
  .controller('LoginCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, $localstorage) {

    // se crea la estructura user, luego aquí se reciben el usuario y la contraseña
    $scope.user = {}

    $localstorage.set("access_token", null)

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

    // función que se ejecuta al presionar el boton Entrar, valida que las credenciales del usuario sean correctas
    $scope.registrarse = function () {

      $ionicHistory.clearHistory()
      $ionicHistory.clearCache().then(function () {
        $state.go('tab.rutinas')
      });
    };
  })

  .controller('CalendarioCtrl', function ($ionicLoading, $log, $scope, Rutinas, $ionicScrollDelegate) {
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

  .controller('RutinasCtrl', function ($ionicLoading, $log, $scope, Rutinas, $ionicScrollDelegate) {

    var vm = this;
    activar()

    //console.log("Rutinas " + JSON.stringify(Rutinas.all()[1]))


    // esta funcion carga la lista de rutinas
    function activar() {
      $ionicScrollDelegate.scrollTop()
      $scope.rutinas = Rutinas.all();
      $scope.remove = function (comunicado) {
        Rutinas.remove(comunicado);
      };
    };
    //--- 

    // esta funcion se usa para el refresh
    $scope.refresh = function () {
      activar()
    };
    //---    

  })

  .controller('NuevaRutinaCtrl', function ($scope) {

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
    $scope.settings = {
      enableFriends: true
    };
  });
