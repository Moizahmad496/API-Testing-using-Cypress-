describe("PUT API Request Template for Partial Update", () => {
  it("should update part of the booking successfully", () => {
    // First, create an auth token (PUT requires authentication)
    cy.request({
      method: "POST",
      url: "https://restful-booker.herokuapp.com/auth",
      body: {
        username: "admin",
        password: "password123",
      },
    }).then((authResponse) => {
      const token = authResponse.body.token;

      // Perform PUT request for partial update
      cy.request({
        method: "PUT",
        url: "https://restful-booker.herokuapp.com/booking/1", // replace with valid booking ID
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: {
          firstname: "Josh",
          lastname: "Allen",
          totalprice: 111,
          depositpaid: true,
          bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01"
          }
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.firstname).to.eq("Josh");
        expect(response.body.lastname).to.eq("Allen");
      });
    });
  });
});
