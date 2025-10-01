describe('PUT API Test', () => {
  it('updates a booking', () => {
    cy.request({
      method: 'PUT',
      url: 'https://restful-booker.herokuapp.com/booking/1', // change ID
      auth: {
        username: 'admin',
        password: 'password123'
      },
      body: {
        firstname: 'James',
        lastname: 'Moiz',
        totalprice: 112,
        depositpaid: true,
        bookingdates: {
          checkin: '2023-01-01',
          checkout: '2023-01-10'
        },
        additionalneeds: 'Breakfast'
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      cy.log(JSON.stringify(res.body))
    })
  })
})

