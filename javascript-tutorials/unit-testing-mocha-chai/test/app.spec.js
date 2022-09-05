const assert = require('assert')
const { expect } = require('chai')
const { add, sub } = require('../src/app')

describe('The Add Function', () => {
    it('Should add 2 numbers together', () => {
        const result = add(2, 2)
        // assert.equal(result, 4)
        expect(result).to.be.eq(4)
    })

    it('Should be able to handle 1 number', () => {
        const result = add(2)
        // assert.equal(result, 2)
        expect(result).to.be.eq(2)
    })

    it('Should be able to handle 0 number', () => {
        const result = add()
        expect(result).to.be.eq(0)
    })

    it('Should return 0 if either argument is not a number', () => {
        const result = add(2, 'test')
        expect(result).to.be.eq(0)
    })
})

describe('The Sub Function', () => {

    it('Should sub 2 numbers together', () => {
        const result = sub(2, 2)
        // assert.equal(result, 0)
        expect(result).to.be.eq(0)
    })

    it('Should be able to handle 1 number', () => {
        const result = sub(2)
        // assert.equal(result, 2)
        expect(result).to.be.eq(2)
    })

    it('Should be able to handle 0 number', () => {
        const result = sub()
        expect(result).to.be.eq(0)
    })

    it('Should return 0 if either argument is not a number', () => {
        const result = sub(2, 'test')
        expect(result).to.be.eq(0)
    })
})