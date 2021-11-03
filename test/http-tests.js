'use strict';
const supertest = require('supertest');
const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const {server,shutdown} = require('../index');

describe('HTTP Tests: ', () => {
    after(function () {
        shutdown();
    });

    it('Can access GET basic information', function(done){
        //Go get all the lists
        supertest(server)
            .get('/')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body).to.be.an('object');
                console.log('Object check OK')
                expect(res.body.secretAgent).to.be.an('string');
                console.log('secretAgent check OK')
                expect(res.body.secretMessage).to.be.an('string');
                console.log('secretMessage check OK')
                expect(res.body.id).to.be.an('string');
                console.log('id equality check OK')
                done();
            })
            .catch(done);
    });

});