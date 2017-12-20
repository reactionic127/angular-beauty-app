export class ServicesService {
  /** @ngInject */
  constructor($http, CONFIG, $q, $localStorage, $rootScope, AuthService) {
    this.AuthService = AuthService;
    this.$http = $http;
    this.CONFIG = CONFIG;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$localStorage = $localStorage;
  }

  getCategories() {
    return this.$http.get(this.CONFIG.API_FULL_URL + '/categories').then((res) => res.data);
  }
  getUserServices(params = {}) {
    return this.$q((resolve, reject) => {
      this.AuthService.showUser().then(user => {
        params.beautician_id = user.id;
        this.$http.get(this.CONFIG.API_FULL_URL + '/services', { params : params }).then((res) => resolve(res.data)).catch(reject)
      })
    });
  }
  remove(id) {
    return this.$http.delete(this.CONFIG.API_FULL_URL + '/services/'+id);
  }
  edit(id, data) {
    return this.$http.put(this.CONFIG.API_FULL_URL + '/services/'+id, data);
  }
  create(data) {
    return this.$http.post(this.CONFIG.API_FULL_URL + '/services', data);
  }
}

