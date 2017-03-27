import phoenixListener from '../../web/static/js/phoenixEventListener';

describe('phoenixEventListener()', function() {

    it("should add an event listener", function() {
        spyOn(document, 'addEventListener');
        phoenixListener();
        expect(document.addEventListener).toHaveBeenCalled();
    });
});