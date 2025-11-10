describe('Authentication & Token Handling', () => {

  it('should login and store token', () => {
    cy.fixture('auth.json').then((authData) => {
      cy.request('POST', 'https://restful-booker.herokuapp.com/auth', {
        username: authData.username,
        password: authData.password
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')
        expect(response.body.token).to.be.a('string')
        expect(response.body.token).to.have.length.greaterThan(0)

        // Save token in cypress environment variable
        Cypress.env('authToken', response.body.token)

        cy.log('Token generated: ' + response.body.token)
      })
    })
  })

})
