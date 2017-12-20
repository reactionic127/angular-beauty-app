export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('app', {
      url: '/',
      component: 'app'
    })
    .state('auth', {
      url: '/auth',
      template: '<ui-view></ui-view>'
    })
    .state('auth.login', {
      url: '/login',
      component: 'login',

    })
    .state('auth.signup', {
      url: '/signup',
      component: 'signup',
    })

    .state('dashboard', {
      url: '/dashboard',
      abstract: true,
      template: '<ui-view></ui-view>'
    })
    .state('dashboard.profile', {
      url: '/profile',
      component: 'profile',
      resolve: {
        /** @ngInject */
        user: (AuthService) => {
          'ngInject';
          return AuthService.showUser();
        },
        /** @ngInject */
        bank: (AuthService) => {
          'ngInject';
          return AuthService.getBankData();
        }
      }
    })
    .state('dashboard.services', {
      url: '/services',
      component: 'services',
      resolve: {
        /** @ngInject */
        categories: (ServicesService) => {
          'ngInject';
          return ServicesService.getCategories();
        },
        /** @ngInject */
        services: (ServicesService) => {
          'ngInject';
          return ServicesService.getUserServices();
        }
      }
    })
    .state('dashboard.payments', {
      url: '/payments',
      component: 'payments',
      resolve: {
        /** @ngInject */
        payments: (PaymentService) => {
          'ngInject';
          PaymentService.getPayments();
        },
        /** @ngInject */
        bookings: (PaymentService) => {
          'ngInject';
          PaymentService.getBookings()
        }
      }
    })
    .state('dashboard.help', {
      url: '/help',
      template: require('./pages/static/help.html')
    })
    .state('dashboard.policy', {
      url: '/policy',
      template: require('./pages/static/policy.html')
    })
    .state('dashboard.terms', {
      url: '/terms',
      template: require('./pages/static/terms.html')
    });
}
