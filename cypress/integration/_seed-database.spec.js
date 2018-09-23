describe('Seed the database', function(){
    before(function(){
        cy.fixture('projects').as('projects')
    })

    it('seeds database', function() {
        console.log('projects', this.projects)
        cy.exec(`python manage.py loaddata ${this.projects}`)
    })
})