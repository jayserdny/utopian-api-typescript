'use strict';
var expect = require('chai').expect;
var utopian = require('../build/index.js');
describe('Utopian api test', () => {
    it('Should return an array', () => {
        return utopian.getModerators().then(function(data) {
            expect(data.total).to.be.an('number');
        });
    });
});