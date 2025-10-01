describe('PATCH API Request Template', () => {
  it('should update part of the booking successfully', () => {
    // First, create an auth token (PATCH requires authentication)
    cy.request({
      method: 'POST',
      url: 'https://restful-booker.herokuapp.com/auth',
      body: {
        username: 'admin',
        password: 'password123'
      }
    }).then((authResponse) => {
      const token = authResponse.body.token;

      // Perform PATCH request
      cy.request({
        method: 'PATCH',
        url: 'https://restful-booker.herokuapp.com/booking/1', // replace with valid booking ID
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`
        },
        body: {
          firstname: 'Moiz',
          lastname: 'Ahmad',
          totalprice: 112
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.firstname).to.eq('Moiz');
        expect(response.body.lastname).to.eq('Ahmad');
      });
    });
  });
});
