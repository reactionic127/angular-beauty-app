export class ProfileController {
  /** @ngInject */
  constructor(AuthService, SweetAlert, $filter, $q, $state, ProfileService) {
    this.$state = $state;
    this.$q = $q;
    this.$filter = $filter;
    this.SweetAlert = SweetAlert;
    this.AuthService = AuthService;
    this.ProfileService = ProfileService;
    this.password = {};
    this.bankAccountType = 'account_details';
  }

  selectPhoto(e) {
    e.target.parentElement.parentElement.querySelector('[type=file]').click();
  }

  changePhoto(e) {
    var reader = new FileReader();
    var photo_uri = '';
    reader.onloadend = () => {
      photo_uri = reader.result;
      if (!this.user.profile_picture) this.user.profile_picture = {};
      this.user.profile_picture.s70 = photo_uri;
      this.saveUser('user photo').then(() => {
        this.SweetAlert.swal({
          title: this.$filter('translate')('success'),
          text: this.$filter('translate')('photo_successfully_changed'),
          type: 'success'
        });
      });
    };
    var file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  saveProfile(form) {
    if (form && form.$invalid) return;
    this.saveUser('user details').then(() => {
      this.SweetAlert.swal({
        title: this.$filter('translate')('success'),
        text: this.$filter('translate')('profile_successfully_changed'),
        type: 'success'
      });
    });
  }

  savePassword(form) {
    if (form && form.$invalid) return;
    angular.extend(this.user, this.password);
    this.passwordErrors = [];
    this.saveUser('user password').then(() => {
      this.SweetAlert.swal({
        title: this.$filter('translate')('success'),
        text: this.$filter('translate')('password_successfully_changed'),
        type: 'success'
      });
    }).then(() => {

    }).catch((err) => {
      angular.forEach(err.data.errors, (v, k) => {
        if (k == 'current_password') {
          this.passwordErrors.push(this.$filter('translate')('current_password_is_invalid'))
        }
      })
    });
  }

  /**
   * Saves or updates user's address.
   * @param {object} address
   */
  saveAddress (address) {
    this.ProfileService.saveAddress(address).then((res) => {
      //this.SweetAlert.swal({
      //  title: this.$filter('translate')('success'),
      //  text: this.$filter('translate')('address_successfully_saved'),
      //  type: 'success'
      //});
    });
  }

  saveUser(type) {
    return this.$q( (resolve, reject) => {
      this.SweetAlert.swal({
          title: "Are you sure?",
          text: `You want update ${type}`,
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3a8e1b",
          confirmButtonText: "Yes, update it!",
          closeOnConfirm: true
        },
        (res) => {
          if (!res) return reject();
            this.AuthService.updateUserData(this.user).then(() => {
              this.AuthService.showUser().then((data) => {
                this.user = data;
                resolve();
              });
            });
        });
    })
  }

  deleteAccount() {
    this.SweetAlert.swal({
      title: "Are you sure?",
      text: "You want delete your account",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3a8e1b",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true
    },
      (res) => {
        if(!res) return;
        this.AuthService.deleteAccount().then(() => {
          this.$state.go('auth.login')
        });
      });
  }

  saveBank(form) {
    if (form && form.$invalid) return;
    this.SweetAlert.swal({
        title: "Are you sure?",
        text: "You want update bank details",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3a8e1b",
        confirmButtonText: "Yes, update it!",
        closeOnConfirm: true
      },
      (res) => {
        if(res)
          return this.AuthService.updateBankData(this.bank).then((data) => {
            this.SweetAlert.swal({
              title: this.$filter('translate')('success'),
              text: this.$filter('translate')('bank_account_successfully_saved'),
              type: 'success'
            });
            this.bank = data;
        });
      });
  }
}
