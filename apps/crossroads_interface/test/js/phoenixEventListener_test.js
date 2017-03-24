import something from '../../web/static/js/phoenixEventListener';

describe('phoenixEventListener()', function() {

    it("should do something", function() {
        expect(something()).toBe('something');
    });

    it('demonstrates a failed test', function() {
        expect(something()).toBe('nothing');
    });
});