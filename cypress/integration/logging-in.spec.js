// This recipe is very similar to the 'Logging In - XHR web form'
// except that is uses regular HTML form submission
// instead of using XHR's.

// We are going to test a few things:
// 1. Test unauthorized routes using cy.visit + cy.request
// 2. Test using a regular form submission (old school POSTs)
// 3. Test error states
// 4. Test authenticated session states
// 5. Use cy.request for much faster performance
// 6. Create a custom command

// Be sure to run `npm start` to start the server
// before running the tests below.

describe('Logging In - HTML Web Form', function(){
    context('HTML form submission', function(){
      beforeEach(function(){
        cy.visit('/index/?section=LogIn')
      })
  
      it('displays errors on login', function(){
        cy.get('input[name=username]').type('jane.lae')
        cy.get('input[name=password]').type('password123{enter}')
  
        // we should have visible errors now
        cy.get('div.error')
          .should('be.visible')
          .and('contain', 'Incorrect Email or Password')
  
        // and still be on the same URL
        cy.url().should('include', '/index/?section=LogIn')
      })
  
      it('redirects to Find Projects on success', function(){
        cy.get('input[name=username]').type('jane.lane')
        cy.get('input[name=password]').type('password123{enter}')
  
        // we should be redirected to /dashboard
        cy.url().should('include', '/index/?section=LogIn')
        cy.get('span.MainHeader-rightContent').should('contain', 'Jane Lane')
  
        // and our cookie should be set to 'cypress-session-cookie'
        cy.getCookie('cypress-session-cookie').should('exist')
      })
    })
  
    context('HTML form submission with cy.request', function(){
      it('can bypass the UI and yet still test log in', function(){
        // oftentimes once we have a proper e2e test around logging in
        // there is NO more reason to actually use our UI to log in users
        // doing so wastes is slow because our entire page has to load,
        // all associated resources have to load, we have to fill in the
        // form, wait for the form submission and redirection process
        //
        // with cy.request we can bypass this because it automatically gets
        // and sets cookies under the hood. This acts exactly as if the requests
        // came from the browser
        cy.request({
            method: 'POST',
            url: '/index/?section=LogIn', // baseUrl will be prepended to this url
            form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
            body: {
              username: 'jane.lane',
              password: 'password123'
            }
          })
  
          // just to prove we have a session
          cy.getCookie('cypress-session-cookie').should('exist')
      })
    })
  
    context('Reusable "login" custom command', function(){
      // typically we'd put this in cypress/support/commands.js
      // but because this custom command is specific to this example
      // we'll keep it here
      Cypress.Commands.add('loginByForm', (username, password) => {
  
        Cypress.log({
          name: 'loginByForm',
          message: username + ' | ' + password
        })
  
        return cy.request({
          method: 'POST',
          url: '/index/?section=LogIn',
          form: true,
          body: {
            username: username,
            password: password
          }
        })
      })
  
      beforeEach(function(){
        // login before each test
        cy.loginByForm('jane.lane', 'password123')
      })
  
      it('can visit Find Projects', function(){
        cy.visit('/index/?section=FindProjects')
        cy.get('p.IntroText').should('contain', 'Welcome to DemocracyLab!')
      })
  
      it('can simply request other authenticated pages', function(){
        // instead of visiting each page and waiting for all
        // the associated resources to load, we can instead
        // just issue a simple HTTP request and make an
        // assertion about the response body
        cy.request('/index/?section=FindProjects')
          .its('p.IntroText')
          .should('contain', 'Welcome to DemocracyLab!')
      })
    })
  })