/// <reference types="cypress" />

const token = 'ey123456789'

describe('Basic Tests', () => {

   before(() => {
      cy.then(() => {
         window.localStorage.setItem('__auth__token', token)
      })
   })

   beforeEach(() => {
      cy.viewport('macbook-13')
      // throw new Error('Opps!')
      cy.visit('https://codedamn.com/login')

      // set localStorage
      // cy.then(() => {
      //    window.localStorage.setItem('__auth__token', token)
      // })

      // cy.pause(): Pauses Cypress code execution
      // cy.debug(): Freezes JS thread (requires Devtool)
   })

   it('Login Page', () => {

      cy.log('Verifying Login Page')
      cy.log('Current URL = ', cy.url())

      cy.url().then(value => {
         cy.log('The current real URL is: ', value)
      })

      cy.url().then(value => {
         console.log('The current real URL is: ', value)
      })

      // cy.contains('Sign In').click()
      cy.get('[data-testid=username]', { timeout: 1 * 1000 }).should('exist')
      cy.get('[data-testid=password]').should('exist')

      // cy.contains('Forgot your password?').click()
      // cy.get('div.text-sm > .font-medium').click()

      cy.url().should('include', '/login')
      cy.url().should('eq', 'https://codedamn.com/login')
      // cy.go('back')
   })
})