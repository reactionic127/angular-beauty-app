import angular from 'angular';

import 'angular-ui-router';
import 'angular-ui-router/release/stateEvents';
import 'angular-material';
import 'ngstorage';
import 'angular-sweetalert';
import 'angular-password';
import 'angular-easyfb';
import 'angular-messages';
import 'angular-sanitize';
import 'angular-translate';
import data_table from 'angular-material-data-table';
import 'angular-material-data-table/dist/md-data-table.css';
import './index.scss';
import routesConfig from './routes';
import themeConfig from './theme';

import {header} from './components/header/header';
import {footer} from './components/footer/footer';
import {main} from './pages/main/main';
import {services} from './pages/services/services';
import {login} from "./pages/login/login";
import {payments} from "./pages/payments/payments";
import {signup} from "./pages/signup/signup";
import {AuthService} from "./services/AuthService";
import {ServicesService} from "./services/ServicesService";
import run from "./run";
import {apiInterceptor} from "./api";
import {profile} from "./pages/profile/profile";
import {translationsConfig} from "./translations";
import {PaymentService} from "./services/PaymentService";
import {ProfileService} from './pages/profile/profile.service';
import {appParameters} from './app.parameters';

angular
  .module('app', ['ui.router', 'ngMaterial', 'ngStorage', 'ngPassword', 'ngMessages',
    'ngSanitize', 'oitozero.ngSweetAlert', data_table, 'pascalprecht.translate', 'ezfb'])
  .config(routesConfig)
  .config(translationsConfig)
  .config(themeConfig)
  .config(apiInterceptor)
  .constant('CONFIG', appParameters)
  .component('app', main)
  .component('login', login)
  .component('signup', signup)
  .component('services', services)
  .component('profile', profile)
  .component('payments', payments)
  .component('beautyHeader', header)
  .component('beautyFooter', footer)
  .service('AuthService', AuthService)
  .service('ServicesService', ServicesService)
  .service('PaymentService', PaymentService)
  .service('ProfileService', ProfileService)
  .run(run);


