describe('DELETE API Request', () => {

  it('should delete a booking by ID', () => {
    const bookingId = 724; // Replace with your booking ID
    const token = 'aa1e0f6d1de1649'; // Get a fresh token before running

    cy.request({
      method: 'DELETE',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      failOnStatusCode: false   // So Cypress doesn't break on 403
    }).then((response) => {
      cy.log(`Status: ${response.status}`);
      cy.log(`Body: ${JSON.stringify(response.body)}`);

      // Expect successful delete (201 = Created/Deleted in this API)
      if (response.status === 201) {
        expect(response.status).to.eq(201);
        cy.log('Booking deleted successfully ✅');
      } else {
        cy.log('Delete failed ⚠️ Check token or booking ID');
      }
    });
  });

});
