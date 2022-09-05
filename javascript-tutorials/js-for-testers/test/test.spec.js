const chai = require('chai')
    , assert = chai.assert
    , expect = chai.expect
    , should = chai.should()

describe('String', () => {

    before(() => {
        console.log('before')
    })

    after(() => {
        console.log('after')
    })

    beforeEach(() => {
        console.log('beforeEach')
    })

    afterEach(() => {
        console.log('beforeAfter')
    })

    let firstName = 'John'
    it('should be doing something', () => {
        firstName.should.be.a('string')     //  Should
        expect(firstName).to.be.a('string') //  Expect
        assert.typeOf(firstName, 'string')  //  Assert
    })

    it('should contain John', () => {
        firstName.should.equal('John')      //  Should
        expect(firstName).to.equal('John')  //  Expect
        assert.equal(firstName, 'John')     //  Assert
    })
})