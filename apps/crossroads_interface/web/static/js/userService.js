/* global CRDS */
import Cookies from 'js-cookie';

window.CRDS = window.CRDS || {};

CRDS.UserService = class UserService {
  constructor() {
    this.userId = Cookies.get('userId');
    this.profileName = Cookies.get('username');
  }

  customizeName(htmlId, fallbackName) {
    const el = document.getElementById(htmlId);
    if (el !== null) {
      const elText = this.profileName !== '' && this.profileName !== undefined
        ? this.profileName
        : fallbackName;
      document.getElementById(htmlId).innerText = elText;
    }
  }
};
