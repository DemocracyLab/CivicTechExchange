describe ('First Test', () => {
    it ('is working', () => {
        expect (true).to.equal (true)
    });
});

describe ('Second Test', () => {
    it ('Visit the app', () => {
        cy.visit ('/');
    });
});