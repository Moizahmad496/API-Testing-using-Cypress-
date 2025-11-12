describe("GET API Request Template", () => {
  it("should successfully fetch data from API", () => {
    cy.request({
      method: "GET",
      url: "https://restful-booker.herokuapp.com/booking", // Replace with your endpoint
    }).then((response) => {
      // ✅ Check response status
      expect(response.status).to.eq(200);

      // ✅ Check response body has expected structure
      response.body.forEach((item) => {
        expect(item).to.have.property("bookingid");
        expect(item.bookingid).to.be.a("number");
      });
    });
  });
});

//Get specific booking based on ID

describe("GET API Request Template", () => {
  it("should successfully fetch data from API for the specific ID", () => {
    cy.request({
      method: "GET",
      url: "https://restful-booker.herokuapp.com/booking/10", // Replace with your endpoint
    }).then((response) => {
      // ✅ Check response status
      expect(response.status).to.eq(200);

      // ✅ Check response body has expected structure
      expect(response.body).to.have.property("bookingdates");
      expect(response.body.bookingdates).to.have.property("checkin");
      expect(response.body.bookingdates).to.have.property("checkout");

  cy.log("Response Body: " + JSON.stringify(response.body, null, 2));
    });
  });
});
