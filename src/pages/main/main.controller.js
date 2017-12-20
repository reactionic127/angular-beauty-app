export class MainController {

/** @ngInject */
  constructor(AuthService, $rootScope) {
    this.user = null;
    this.AuthService = AuthService;
    this.init();
    $rootScope.$on('userUpdated', () => {
      this.init();
    });
  }

  init() {
    this.AuthService.showUser().then(data => {
      this.user = data;
    }).catch(() => {
      this.user = null;
    });
  }
}
