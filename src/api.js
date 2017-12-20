/**
 * @ngInject
 * Sets request interceptors.
 */
export function apiInterceptor($httpProvider) {
  $httpProvider.interceptors.push(RequestInterceptor);
}

/** @ngInject */
function RequestInterceptor($q, $injector, $localStorage, CONFIG) {
  return {
    
    // optional method
    'request': function(config) {
      if(config.data && config.data.toString() == '[object FormData]') {
        config.headers['Content-Type'] = undefined;
      }
      if($localStorage.tokens && $localStorage.tokens.access_token && config.url.indexOf(CONFIG.API_BASE) > -1) {
        if (!config.params) 
          config.params = {};
        
        config.params.access_token = $localStorage.tokens.access_token;
      }
      return config;
    },

    // optional method
    'responseError': function(rejection) {
      // do something on error
      if (rejection.status == 401) {
        const $state = $injector.get('$state');
        delete $localStorage.tokens;
        if($state.current.name != 'app')
          $state.go('auth.login');
      }
      return $q.reject(rejection);
    }
  };
}
