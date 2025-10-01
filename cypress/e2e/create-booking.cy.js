describe('Booking API Test Suite', () => {

  let bookingId; // will store created booking id

  // ✅ Create Booking
  it('should create a new booking', () => {
    cy.request({
      method: 'POST',
      url: 'https://restful-booker.herokuapp.com/booking',
      body: {
         "firstname" : "Moiz",
    "lastname" : "Ahmad",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
        },
        additionalneeds: 'Breakfast'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('bookingid')
      bookingId = response.body.bookingid
      cy.log('Created Booking ID: ' + bookingId)
    })
  })})
