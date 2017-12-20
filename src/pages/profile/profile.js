import './profile.scss';
import {ProfileController} from "./profile.controller";

export const profile = {
  template: require('./profile.html'),
  controller: ProfileController,
  bindings: {
    user: '<',
    bank: '<'
  }
};
