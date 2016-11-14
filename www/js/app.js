// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // LOGIN DE APLICAIÓN
      .state('login', {
        url: "/login",
        cache: false,
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
      })

      // SIGNUP DE APLICAIÓN
      .state('registro', {
        url: "/registro",
        cache: false,
        templateUrl: "templates/registro.html",
        controller: 'RegistroCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'tabController'
      })

      // Mis rutinas
      .state('tab.rutinas', {
        cache: false,
        url: '/rutinas',
        views: {
          'tab-rutinas': {
            templateUrl: 'templates/tab-rutinas.html'
          }
        }
      })
      
      .state('tab.rutina-detalle', {
        cache: false,
        url: '/rutina-detalle/:rutinaId',
        views: {
          'tab-rutinas': {
            templateUrl: 'templates/rutina-detalle.html',
            controller: 'RutinaDetalleCtrl'
          }
        }
      })      

      // Calendario profe
      .state('tab.calendarioProfe', {
        cache: false,
        url: '/calendarioProfe',
        views: {
          'tab-calendarioProfe': {
            templateUrl: 'templates/tab-calendarioProfe.html',
            controller: 'CalendarioProfeCtrl'
          }
        }
      })
      
      .state('tab.nuevoEntrenamiento', {
        cache: false,
        url: '/nuevoEntrenamiento',
        views: {
          'tab-calendarioProfe': {
            templateUrl: 'templates/nuevoEntrenamiento.html'
          }
        }
      })
      
      .state('tab.enviarEntrenamiento', {
        cache: false,
        url: '/enviarEntrenamiento/:idRutina',
        views: {
          'tab-calendarioProfe': {
            templateUrl: 'templates/enviarEntrenamiento.html'
          }
        }
      })       
      
      .state('tab.entrenamiento-detalle', {
        cache: false,
        url: '/entrenamiento-detalle/:entrenamientoId/:atletaId/:fecha',
        views: {
          'tab-calendarioProfe': {
            templateUrl: 'templates/entrenamiento-detalle.html',
            controller: 'EntrenamientoDetalleCtrl'
          }
        }
      })                           
      
      // Calendario atleta
      .state('tab.calendarioAtleta', {
        url: '/calendarioAtleta',
        views: {
          'tab-calendarioAtleta': {
            templateUrl: 'templates/tab-calendarioAtleta.html',
            controller: 'CalendarioAtletaCtrl'
          }
        }
      })      

      // Each tab has its own nav history stack:

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
