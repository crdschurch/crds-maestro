/* global CRDS */
import UserService from '../../web/static/js/userService';

describe('UserService', () => {
  const deleteCookie = function (name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };
  const testDom = `<h1>Welcome, <span id="foo"></span></h1>`;
  let user;
  let welcomeTitle;

  beforeEach(() => {
    document.body.innerHTML = testDom;
    welcomeTitle = document.getElementById('foo');
  });

  afterEach(() => {
    deleteCookie('username');
    user = null;
    welcomeTitle = null;
  });

  it('should customize the welcome message based on user name', () => {
    document.cookie = 'username=Rodney';
    user = new CRDS.UserService();
    user.customizeName('foo', 'Cool Guy');
    expect(welcomeTitle.innerText).toEqual('Rodney');
  });

  it('should fallback if no name is detected', () => {
    user = new CRDS.UserService();
    user.customizeName('foo', 'Bodacious Dude');
    expect(welcomeTitle.innerText).toEqual('Bodacious Dude');
  });

  it('should fallback if name is set to an empty string', () => {
    document.cookie = 'username= ';
    user = new CRDS.UserService();
    user.customizeName('foo', 'No Name');
    expect(welcomeTitle.innerText).toEqual('No Name');
  });

  it('should not do anything if the ID is not on the page', () => {
    user = new CRDS.UserService();
    user.customizeName('beef', 'Fellow Carnivore');
    expect(welcomeTitle.innerText).toEqual('');
  });
});
