describe ('Simple  test for the spec runner to see it in action', function(done) {
    it('contains spec with an assert', function () {
        assert(1 == '1', 'Passed!');
    });
    it('contains spec with an expect', function() {
    	var foo = {bar: 'asima'};
    	expect(foo).to.deep.equal({bar: 'asima'});
    });
});
