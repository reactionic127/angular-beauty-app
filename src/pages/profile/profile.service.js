/**
 * Service that handles all user profile logics.
 */
export class ProfileService {

  /**
   * @ngInject
   */
  constructor ($http, $q, CONFIG) {
    this.$http = $http;
    this.$q = $q;
    this.CONFIG = CONFIG;
  }

  /**
   * Method that creates or updates user's address.
   * @param {object} address
   *
   * TODO: issue on creating address - right after creating an address it should be added to the current user
   */
  saveAddress (address) {
    return this.$q((resolve, reject) => {

      // Data so send within request.
      var requestData = new FormData();
      angular.forEach(address, (value, key) => {
        requestData.append(`address[${key}]`, value);
      });

      var createAddressPromise = this.$http.post(this.CONFIG.API_FULL_URL + "/addresses", requestData);
        //updateAddressPromise = this.$http.put(this.CONFIG.API_FULL_URL + "/addresses/" + id, requestData);

      createAddressPromise.then((res) => {
        console.log(res)
      });
    });
  }

}
