
import find from 'lodash/find';
export default run;

/** @ngInject */
function run($transitions, AuthService, $translate, CONFIG, ezfb) {
  
  $transitions.onStart({ to: 'auth.**' }, function(trans) {
    var $localStorage = trans.injector().get('$localStorage');
    if ($localStorage.tokens && $localStorage.tokens.access_token) {

      return trans.router.stateService.target('app');
    }
  });
  $transitions.onStart({ to: 'dashboard.**' }, function(trans) {
    var $localStorage = trans.injector().get('$localStorage');
    if (!($localStorage.tokens && $localStorage.tokens.access_token)) {

      return trans.router.stateService.target('auth.login');
    }
  });

  AuthService.getLanguages().then(data => {
    AuthService.showUser().then(user => {

      if(user.language) {
        var curr = find(data, {name: user.language.name});
        if(curr)
          $translate.use(curr.country.toLowerCase());
      }
    });
  });

  /**
   * Depending on environment choosing different facebook app to login.
   */
  ezfb.init({
    appId : location.hostname == 'localhost' || location.hostname == '172.16.208.7' 
      ? CONFIG.facebook_test_app_id 
      : CONFIG.facebook_app_id
  });
}

