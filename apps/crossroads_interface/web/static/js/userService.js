/* global CRDS */
import Cookies from 'js-cookie';

window.CRDS = window.CRDS || {};

CRDS.UserService = class UserService {
  constructor() {
    this.userId = Cookies.get('userId');
    this.profileName = Cookies.get('username');
  }

  customizeName(htmlId, fallbackName) {
    if (htmlId !== undefined) {
      const elText = this.profileName !== undefined ? this.profileName : fallbackName;
      document.getElementById(htmlId).innerText = elText;
    } else {
      console.warn(`${htmlId} does not exist on the page.`);
    }
  }
};
