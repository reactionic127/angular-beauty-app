import './login.scss';

class LoginController {
  /** @ngInject */
  constructor(AuthService, $state, $filter) {
    this.$filter = $filter;
    this.error = null;
    this.data = {};
    this.AuthService = AuthService;
    this.$state = $state;
  }

  process() {
    this.AuthService.login(this.data).then(data => {
      this.$state.go('app');
    }).catch(err => {
      this.error = err.data.error == 'invalid_grant'?
        this.$filter('translate')('invalid_username_or_password'): err.data.error == 'role_user'?
        this.$filter('translate')('invalid_group'): this.$filter('translate')('unknown_error');
    });
  }

  loginFacebook() {
    this.AuthService.getFacebookData().then(data => {
      this.AuthService.login(null, data.accessToken).then(data => {
        this.$state.go('app');
      }).catch(err => {
        if(err.status == "401"){
          this.SweetAlert.swal({title: 'Error', type: 'error', template: this.$filter('translate')('you_not_registered_with_facebook_account')});
        }
        this.error = err.data.error == 'invalid_grant'?
          this.$filter('translate')('invalid_username_or_password'): this.$filter('translate')('unknown_error');
        this.error = err.data.error == 'role_user'?
          this.$filter('translate')('invalid_group'): this.$filter('translate')('unknown_error');
      });
    }).catch(err => {
    })
  }
}

export const login = {
  template: require('./login.html'),
  controller: LoginController
};
