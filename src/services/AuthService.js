export class AuthService {
  /** @ngInject */
  constructor($http, CONFIG, $q, $localStorage, $rootScope, ezfb) {
    this.ezfb = ezfb;
    this.$http = $http;
    this.CONFIG = CONFIG;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$localStorage = $localStorage;
    this.userCache = null;
  }

  getFacebookData() {
    return this.$q((resolve, reject) => {
      var res = this.ezfb.login(null, { scope : 'email,user_about_me,user_birthday' });
      res.then((user) => {

        if(!user.authResponse.accessToken) return reject();

        resolve(user.authResponse);

        //return this.$http.get('https://graph.facebook.com/v2.5/me', {
        //  params: {
        //    access_token: user.access_token,
        //    fields: 'email,name,id,gender,last_name,first_name'
        //  }
        //}).then(res => {
        //  res.data.access_token = user.access_token;
        //  resolve(res.data);
        //}).catch(reject);

      }).catch(reject);

    })
  }

  signUp(User) {
    this.userCache = null;
    User.email.toLowerCase();
    var fd = new FormData();
    fd.append('user[role]', "beautician");
    if(User.password) fd.append('user[password]', User.password);
    if(User.email) fd.append('user[email]', User.email);
    if(User.name) fd.append('user[name]', User.name);
    fd.append('user[sex]', User.sex || 'other');
    if(User.facebook_token) fd.append('user[facebook_token]', User.facebook_token);
    if(User.surname) fd.append('user[surname]', User.surname);
    if(User.language) fd.append('user[language_id]', User.language);
    if(User.username) fd.append('user[username]', '@' + User.username);
    return this.$q((resolve, reject) => {
      this.$http.post(this.CONFIG.API_FULL_URL + "/registrations.json", fd, {
        headers: {'Content-Type': undefined}
      }).then((res) => {
        this.login(User).then((userData) => {
          resolve(userData);
        }, (err) => {
          console.log('*** login error while registering: ' + angular.toJson(err));
          reject(err);
        });
      }, (error) => {
        console.log('*** register error: ' + angular.toJson(error));
        reject(error.data);
      });
    });
  }

  deleteAccount() {
    this.userCache = null;
    return this.$q((resolve, reject) => {
      this.$http.delete(this.CONFIG.API_FULL_URL + '/me').then(() => {
        this.signOut().then(() => {
          resolve();
        });
      })
    });
  }

  login(User, token = null) {
    this.userCache = null;
    var fd;
    console.log(66, 'AuthService', token);

    // email + password login case
    if (token == null) {
      User.email.toLowerCase();
      fd = new FormData();
      fd.append('grant_type', 'password');
      fd.append('username', User.email);
      fd.append('password', User.password);
    }

    // facebook api login
    else {
      fd = new FormData();
      fd.append('grant_type', 'assertion');
      fd.append('assertion', token);
    }

    return this.$q((resolve, reject) => {
      // Sending accessToken to the API to check it's validity
      this.$http.post(this.CONFIG.API_BASE + "/oauth/token", fd, { headers: { 'Content-Type' : undefined } })
        .then((res) => {
        var access_token = res.data.access_token;
        this.$localStorage.tokens = res.data;
        this.userCache = null;
        this.showUser(access_token).then((user) => {
          if(user.role == 'user') {
            this.userCache = null;
            delete this.$localStorage.tokens;
            reject({data: {error: 'role_user'}});
          } else {
            this.$localStorage.CurrentUser = user;
            this.$rootScope.$broadcast('userUpdated');
            resolve(res.data);
          }
        }, (error) => {
          reject(error);
        });

      }, (error) => {
        reject(error);
      });
    });
  }

  showUser() {
    if (this.userCache) return this.userCache;
    return this.userCache = this.$q((resolve, reject) => {
      this.$http.get(this.CONFIG.API_FULL_URL + "/me").then((res) => {

        //storeUser(res.data);
        resolve(res.data);
      }, (error) => {
        console.log("*** error : " + angular.toJson(error));
        var msg;
        if (error.data && error.data.code === "ConflictError") {
          msg = "duplicate";
        }
        reject(msg);
      });
    });
  }

  updateUserData(data) {
    return this.$q((resolve, reject) => {
      this.userCache = null;
      var fd = new FormData();
      angular.forEach(data, function (v, k) {
        if(['name', 'surname', 'sex', 'profile_picture', 'bio','phone_number', 'language_id', 'password', 'current_password'].indexOf(k) == -1 ) return;
        if (k == 'profile_picture')
          fd.append('user[' + k + ']', v.s70);
        else
          fd.append('user[' + k + ']', v)
      });
      this.$http.put(this.CONFIG.API_FULL_URL + "/me", fd, {headers: {'Content-Type': undefined}}).then((res) => {

        //storeUser(res.data);
        this.$rootScope.$broadcast('userUpdated');
        resolve(res.data);
      }, (error) => {
        console.log("*** error : " + angular.toJson(error));
        var msg;
        reject(error);
      });
    });
  }

  getLanguages() {
    if(this.langCache) return this.langCache;
    return this.langCache = this.$http.get(this.CONFIG.API_FULL_URL + '/languages', { cache : true }).then(res => res.data)
  }

  getBankData() {
    return this.$http.get(this.CONFIG.API_FULL_URL + '/bank_account').then(res => res.data)
  }

  updateBankData(data) {
    let fd = new FormData();
    angular.forEach(data, (v, k) => fd.append(`bank_account[${k}]`, v));
    return this.$http.post(this.CONFIG.API_FULL_URL+'/bank_account', fd).then(res => res.data)
  }

  signOut() {
    this.userCache = null;
    return this.$q((resolve, reject) => {
      this.$http.post(this.CONFIG.API_BASE + "/oauth/revoke", {headers: {'Authorization': 'Bearer' + this.$localStorage.tokens ? this.$localStorage.tokens.access_token : ''}}).then((res) => {

        this.$rootScope.$broadcast('userUpdated');
        delete this.$localStorage.tokens;
        resolve(res.data);
      }, (error) => {
        console.log("*** error : " + angular.toJson(error));
        var msg;
        if (error.data && error.data.code === "ConflictError") {
          msg = "duplicate";
        }
        reject(msg);
      });
    });
  }

  changePass(password, current_password) {
    var fd = new FormData;
    fd.append('user[password]', password);
    fd.append('user[current_password]', current_password);
    return this.$q((resolve, reject) => {
      this.$http.put(this.CONFIG.API_FULL_URL + "/me", fd, {
        headers: {'Content-Type': undefined}
      }).then((res) => {
        //server response is empty by design
        console.warn(res);
        resolve(res.data);
      }, (error) => {
        console.log("*** error : " + angular.toJson(error));
        reject(error);
      });
    });
  }

  registerFB(User) {
    //console.log("**** FB user: " + angular.toJson(User));
    return this.$q((resolve, reject) => {
      this.$http.post(this.CONFIG.API_FULL_URL + "/registrations.json", User, {headers: {'Content-Type': undefined}}).then((res) => {

        resolve(res.data);
        $state.go("tab.map");
      }).catch((error) => {
        //console.log("*** error : " + angular.toJson(error));
        $ionicLoading.hide();
        console.log(error);
        if (error.data.errors.email == "has already been taken" || error.status) {
          var showAlert = () => {
            var alertPopup = $ionicPopup.alert({
              title: $filter('translate')('EMAIL_TAKEN'),
              template: $filter('translate')("PLEASE_SIGN")
            })
          };
          showAlert();
        }

        //
      });
    });
  }

  authFB(request) {
    return this.$q((resolve, reject) => {
      this.$http.post(this.CONFIG.API_BASE + "/oauth/token", request, { headers : { 'Content-Type' : undefined } }).then((res) => {

        resolve(res);
        //$state.go("tab.map");
      }).catch((error) => {
        console.log("*** error2 : " + angular.toJson(error));
        if (error.status == "401") {
          var showAlert = () => {
            var alertPopup = $ionicPopup.alert({
              title: "Beautyapp",
              template: $filter('translate')('FACEBOOK_NOT_REGISTERED')
            })
          };

          showAlert();
        }
        $ionicLoading.hide();


        //
      });
    });
  }
}

