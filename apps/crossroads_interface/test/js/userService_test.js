/* global CRDS */
import UserService from '../../web/static/js/userService';

describe('UserService', () => {
  const testDom = `
    <h1>Welcome, <span id="foo"></span></h1>
  `;

  const deleteCookie = function (name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };

  let user;
  let welcomeTitle;

  beforeEach(() => {
    document.body.innerHTML = testDom;
    user = new CRDS.UserService();
    welcomeTitle = document.getElementById('foo');
    document.cookie = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    user = null;
    welcomeTitle = null;
    deleteCookie('username');
  });

  fit('should customize the welcome message based on user name', () => {
    document.cookie = 'username=Rodney';
    user = new CRDS.UserService();
    user.customizeName('foo', 'Cool Guy');
    expect(welcomeTitle.innerText).toEqual('Rodney');
  });

  it('should fallback if no name is detected', () => {
    user.customizeName('foo', 'Bodacious Dude');
    expect(welcomeTitle.innerText).toEqual('Bodacious Dude');
  });
});
