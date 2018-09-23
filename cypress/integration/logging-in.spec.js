describe('Log In', function(){
    context('HTML form submission', function(){
      beforeEach(function(){
        cy.fixture('users').as('users')
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
        cy.get('input[name=username]').type(this.users[0].fields.username)
        cy.get('input[name=password]').type(this.users[0].fields.password).type('{enter}')
  
        // we should be redirected to Find Projects
        cy.url().should('include', '/index/?section=FindProjects')
        cy.get('span.MainHeader-rightContent').should('contain', 'Democracy Lab')
      })
    })
  
    context('Reusable "login" custom command', function(){
      beforeEach(function(){
        cy.fixture('users').as('users')
      })
  
      it('can visit Find Projects', function(){
        cy.loginByForm(this.users[0].fields.username, this.users[0].fields.password)
        cy.visit('/index/?section=FindProjects')
        cy.get('p.IntroText').should('contain', 'Welcome to DemocracyLab!')
      })
    })
  })