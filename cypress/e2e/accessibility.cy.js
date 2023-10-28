import "cypress-axe";

describe('Accessibility (a11y)',()=>{
  it('has a sitemap',()=>{
    cy.request("http://localhost:8000/sitemap.xml")
  })

  it('should be accessible', () => {
    cy.task('sitemapLocations').then(pages => {
      pages.forEach(page => {
        cy.visit(page)
        cy.injectAxe()
        cy.checkA11y(null,{
          //includedImpacts:['minor','moderate','serious','critical']
          includedImpacts:['critical']
        })
      })
    })
  })
})
