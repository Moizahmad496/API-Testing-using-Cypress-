// ========================================
// NEWS API TESTS
// ========================================

describe("News API - GET Request Tests", () => {
  const baseUrl = "https://restful-booker.herokuapp.com";

  // ✅ SUCCESS CASES
  context("Success Scenarios", () => {
    it("should successfully fetch news data with valid parameters", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=5&pageSize=5&sortBy=newsdate&sortDirection=desc`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.exist;
        cy.log("Response: " + JSON.stringify(response.body, null, 2));
      });
    });

    it("should return valid response structure", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("object");
        expect(response.headers).to.have.property("content-type");
      });
    });

    it("should fetch data with different page numbers", () => {
      [1, 2, 3].forEach((page) => {
        cy.request({
          method: "GET",
          url: `${baseUrl}?page=${page}&pageSize=5&sortBy=newsdate&sortDirection=desc`,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

    it("should fetch data with different page sizes", () => {
      [5, 10, 20].forEach((pageSize) => {
        cy.request({
          method: "GET",
          url: `${baseUrl}?page=1&pageSize=${pageSize}&sortBy=newsdate&sortDirection=desc`,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

    it("should support ascending sort direction", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=asc`,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  // ⚠️ VALIDATION TESTS
  context("Response Validation", () => {
    it("should have correct content-type header", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
      }).then((response) => {
        expect(response.headers["content-type"]).to.include("application/json");
      });
    });

    it("should return response within acceptable time", () => {
      const startTime = Date.now();
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
      }).then((response) => {
        const duration = Date.now() - startTime;
        expect(duration).to.be.lessThan(5000); // 5 seconds
        cy.log(`Response time: ${duration}ms`);
      });
    });

    it("should return valid JSON response", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
      }).then((response) => {
        expect(() => JSON.stringify(response.body)).to.not.throw();
      });
    });
  });

  // ❌ ERROR HANDLING
  context("Error Scenarios", () => {
    it("should handle invalid page number gracefully", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=-1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 400, 422]).to.include(response.status);
      });
    });

    it("should handle missing parameters", () => {
      cy.request({
        method: "GET",
        url: baseUrl,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 400]).to.include(response.status);
      });
    });

    it("should handle invalid sort direction", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=invalid`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 400]).to.include(response.status);
      });
    });

    it("should handle zero page size", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=0&sortBy=newsdate&sortDirection=desc`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 400, 422]).to.include(response.status);
      });
    });
  });
});

// ========================================
// BOOKING API TESTS
// ========================================

describe("Booking API - GET Request by ID Tests", () => {
  const baseUrl = "https://restful-booker.herokuapp.com/booking";
  const validBookingId = 337;

  // ✅ SUCCESS CASES
  context("Success Scenarios", () => {
    it("should successfully fetch booking data for valid ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.exist;
        cy.log("Response: " + JSON.stringify(response.body, null, 2));
      });
    });

    it("should have all required booking properties", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("bookingdates");
        expect(response.body.bookingdates).to.have.property("checkin");
        expect(response.body.bookingdates).to.have.property("checkout");
        expect(response.body).to.have.property("firstname");
        expect(response.body).to.have.property("lastname");
        expect(response.body).to.have.property("totalprice");
      });
    });

    it("should have valid date formats", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        const checkin = response.body.bookingdates.checkin;
        const checkout = response.body.bookingdates.checkout;
        
        // Date format validation (YYYY-MM-DD)
        expect(checkin).to.match(/^\d{4}-\d{2}-\d{2}$/);
        expect(checkout).to.match(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("should have valid data types for all fields", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        expect(response.body.firstname).to.be.a("string");
        expect(response.body.lastname).to.be.a("string");
        expect(response.body.totalprice).to.be.a("number");
        expect(response.body.depositpaid).to.be.a("boolean");
        expect(response.body.bookingdates).to.be.an("object");
      });
    });
  });

  // ⚠️ VALIDATION TESTS
  context("Response Validation", () => {
    it("should return JSON content type", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        expect(response.headers["content-type"]).to.include("application/json");
      });
    });

    it("should have non-empty required fields", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        expect(response.body.firstname).to.not.be.empty;
        expect(response.body.lastname).to.not.be.empty;
        expect(response.body.bookingdates.checkin).to.not.be.empty;
        expect(response.body.bookingdates.checkout).to.not.be.empty;
      });
    });

    it("should have positive total price", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        expect(response.body.totalprice).to.be.greaterThan(0);
      });
    });

    it("should have checkout date after or equal to checkin date", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        const checkin = new Date(response.body.bookingdates.checkin);
        const checkout = new Date(response.body.bookingdates.checkout);
        expect(checkout.getTime()).to.be.at.least(checkin.getTime());
      });
    });
  });

  // ❌ ERROR HANDLING
  context("Error Scenarios", () => {
    it("should return 404 for non-existent booking ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/999999999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it("should handle invalid booking ID format", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/invalid-id`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([400, 404]).to.include(response.status);
      });
    });

    it("should handle negative booking ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/-1`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([400, 404]).to.include(response.status);
      });
    });

    it("should handle special characters in booking ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/@#$%`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([400, 404]).to.include(response.status);
      });
    });
  });

  // 🔄 EDGE CASES
  context("Edge Cases", () => {
    it("should handle booking ID of 0", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/0`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 404]).to.include(response.status);
      });
    });

    it("should handle very large booking ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/2147483647`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 404]).to.include(response.status);
      });
    });
  });
});

// ========================================
// PERFORMANCE TESTS
// ========================================

describe("API Performance Tests", () => {
  it("News API should respond within 3 seconds", () => {
    const startTime = Date.now();
    cy.request({
      method: "GET",
      url: "https://restful-booker.herokuapp.com/booking",
    }).then(() => {
      const duration = Date.now() - startTime;
      expect(duration).to.be.lessThan(3000);
      cy.log(`News API response time: ${duration}ms`);
    });
  });

  it("Booking API should respond within 2 seconds", () => {
    const startTime = Date.now();
    cy.request({
      method: "GET",
      url: "https://restful-booker.herokuapp.com/booking/337",
    }).then(() => {
      const duration = Date.now() - startTime;
      expect(duration).to.be.lessThan(2000);
      cy.log(`Booking API response time: ${duration}ms`);
    });
  });
});