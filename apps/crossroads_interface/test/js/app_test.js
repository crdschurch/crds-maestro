import { App } from '../../web/static/js/app';
import * as phoenixEventListener from '../../web/static/js/phoenixEventListener';

describe('App', function() {

    it('should exist', () => {
        expect(App).toBeTruthy();
    });

    it('should create event listeners when run() is called', () => {
        spyOn(phoenixEventListener, 'default');
        App.run();
        expect(phoenixEventListener.default).toHaveBeenCalled();
    });

});