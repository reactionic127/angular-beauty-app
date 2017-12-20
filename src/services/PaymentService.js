import filter from 'lodash/filter';

export class PaymentService {
  /** @ngInject */
  constructor($http, CONFIG) {
    this.$http = $http;
    this.CONFIG = CONFIG;
  }

  getPayments() {
    return this.$http.get(this.CONFIG.API_FULL_URL + '/payments').then(res => res.data);
  }

  getBookings() {
    return this.$http.get(this.CONFIG.API_FULL_URL + '/bookings', {params: {status: 4}}).then(res => filter(res.data, (v) => v.paid_out == false));
  }
}

