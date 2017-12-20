import './services.scss';
import {ServicesController} from "./services.controller";

export const services = {
  template: require('./services.html'),
  controller: ServicesController,
  bindings: {
    categories: '<',
    services: '<'
  }
};
