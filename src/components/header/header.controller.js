import map from 'lodash/map';
import find from 'lodash/find';

export class HeaderController {
  /** @ngInject */
  constructor(AuthService, $rootScope, $translate) {
    this.$translate = $translate;
    this.user = null;
    this.AuthService = AuthService;
    this.init();
    $rootScope.$on('userUpdated', () => {
      this.init();
    });
    this.language = 'us';
    this.languages = [];

    this.loadLangs();
  }

  loadLangs() {
    return this.AuthService.getLanguages().then(langs => {
      this.languages = map(langs, (v) => {
        return {value: v.country.toLowerCase(), name: v.name, id: v.id};
      });
    });
  }

  init() {
    this.AuthService.showUser().then(data => {
      this.user = data;
      if (data.language) {
        if (this.languages.length == 0) {
          this.loadLangs().then(langs => {
            var curr = find(this.languages, {name: data.language.name});
            this.language = curr.value;
            this.$translate.use(curr.value);
          });
        }
        else {
          var curr = find(this.languages, {name: data.language.name});
          this.language = curr.value;
          this.$translate.use(curr.value);
        }
      }

    }).catch(() => {
      this.user = null;
    });
  }

  changeLanguage() {
    var curr = find(this.languages, {value: this.language});
    this.AuthService.updateUserData({language_id: curr.id});
    this.$translate.use(curr.value);
  }

  openMenu($mdOpenMenu, ev) {
    $mdOpenMenu(ev);
  };

  logout() {
    this.AuthService.signOut();
  }
}

