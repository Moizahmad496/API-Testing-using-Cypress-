
describe('GET API Request Template', () => {

  it('should successfully fetch data from API for the specific Name', () => {
   cy.request({
  method: 'GET',
  url: 'https://restful-booker.herokuapp.com/booking',
  qs: {
    firstname: 'Susan'
  }
}).then((response) => {
  expect(response.status).to.eq(200)
  cy.log(JSON.stringify(response.body))
})


  })

})
