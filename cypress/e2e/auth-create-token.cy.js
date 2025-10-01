describe('Authentication & Token Handling', () => {

  it('should login and store token', () => {
    cy.request('POST', 'https://restful-booker.herokuapp.com/auth', {
      username: "admin",
      password: "password123"
    }).then((response) => {
      expect(response.status).to.eq(200)

      // Save token in Cypress env for later tests
      Cypress.env('authToken', response.body.token)

      cy.log('Token: ' + response.body.token)
    })
  })

})
