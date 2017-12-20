export class SignUpController {
  /** @ngInject */
  constructor(AuthService, $state, $mdDialog, $sce, $filter, $http) {
    this.$http = $http;
    this.$filter = $filter;
    this.$sce = $sce;
    this.$mdDialog = $mdDialog;
    this.AuthService = AuthService;
    this.$state = $state;
    this.errors = null;
    this.genders = [
      {name: 'Male', value: 'male'},
      {name: 'Female', value: 'female'},
      {name: 'Other', value: 'other'},
    ];
    this.data = {language: 1, sex: 'other'};
    this.languages = [];
    this.AuthService.getLanguages().then(data => {
      this.languages = data;
      this.data.language = data[0].id;
    });
  }

  signupFacebook () {
    this.AuthService.getFacebookData().then(data => {
      this.data.name = data.first_name;
      this.data.surname = data.last_name;
      this.data.email = data.email;
      this.data.sex = data.gender;
      this.data.facebook_token = data.access_token;
    }).catch(data => {
      this.$mdDialog.show(
        this.$mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Sorry!')
          .htmlContent(`Something went wrong, please try again`)
          .ariaLabel('Registration success dialog')
          .ok(this.$filter('translate')('signup_modal_button_text'))
      )
    })
  }

  process(form) {
    if (form && form.$invalid) return;
    this.AuthService.signUp(this.data).then(data => {
      this.$mdDialog.show(
        this.$mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Congratulations! ')
          .htmlContent(`
          <p>${this.$filter('translate')('signup_text_line_1')}</p>
          <p>${this.$filter('translate')('signup_text_line_2')}</p>
          <ul>
            <li>${this.$filter('translate')('signup_text_line_3')}</li>
            <li>${this.$filter('translate')('signup_text_line_4')}</li>
          </ul>
        `)
          .ariaLabel('Registration success dialog')
          .ok(this.$filter('translate')('signup_modal_button_text'))
      ).then(() => {
        this.$state.go('app');
      });
    }).catch(err => {
      this.errors = err.errors;
    });
  }

  passwordValidation(inputValue) {
    console.log("signup validation", inputValue);
    if(inputValue.length > 6){
      return false
    } else {
      return true
    }
  }

  compareTo() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
  }
}


