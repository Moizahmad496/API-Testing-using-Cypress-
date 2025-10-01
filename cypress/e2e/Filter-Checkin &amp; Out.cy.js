
describe('GET API Request Template', () => {

  it('should successfully fetch data from API for the specific checkin & check out filter', () => {
   cy.request({
  method: 'GET',
  url: 'https://restful-booker.herokuapp.com/booking',
  qs: {
    checkin: '2023-01-03',
    checkout: '2024-03-14'

  }
}).then((response) => {
  expect(response.status).to.eq(200)
  cy.log(JSON.stringify(response.body))
})


  })

})
