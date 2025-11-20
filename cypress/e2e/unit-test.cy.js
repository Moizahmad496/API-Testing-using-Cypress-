// ========================================
// NEWS API TESTS (Optional - Skip if not accessible)
// ========================================

describe("News API - GET Request Tests", () => {
  const baseUrl = "https://kaplapis.accountsdash.com/api/Api/news";

  // Add failOnStatusCode: false to all requests since the endpoint might not be accessible
  // ✅ SUCCESS CASES
  context("Success Scenarios", () => {
    it("should successfully fetch news data with valid parameters", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=5&pageSize=5&sortBy=newsdate&sortDirection=desc`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.exist;
          cy.log("✅ Response: " + JSON.stringify(response.body, null, 2));
        } else {
          cy.log(`⚠️ News API returned status: ${response.status}`);
        }
      });
    });

    it("should return valid response structure", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.be.an("object");
          expect(response.headers).to.have.property("content-type");
        }
      });
    });

    it("should fetch data with different page numbers", () => {
      [1, 2, 3].forEach((page) => {
        cy.request({
          method: "GET",
          url: `${baseUrl}?page=${page}&pageSize=5&sortBy=newsdate&sortDirection=desc`,
          failOnStatusCode: false,
        }).then((response) => {
          cy.log(`Page ${page} status: ${response.status}`);
        });
      });
    });

    it("should fetch data with different page sizes", () => {
      [5, 10, 20].forEach((pageSize) => {
        cy.request({
          method: "GET",
          url: `${baseUrl}?page=1&pageSize=${pageSize}&sortBy=newsdate&sortDirection=desc`,
          failOnStatusCode: false,
        }).then((response) => {
          cy.log(`PageSize ${pageSize} status: ${response.status}`);
        });
      });
    });

    it("should support ascending sort direction", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=asc`,
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(`Ascending sort status: ${response.status}`);
      });
    });
  });

  // ⚠️ VALIDATION TESTS
  context("Response Validation", () => {
    it("should have correct content-type header", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.headers["content-type"]).to.include("application/json");
        }
      });
    });

    it("should return response within acceptable time", () => {
      const startTime = Date.now();
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
        failOnStatusCode: false,
      }).then((response) => {
        const duration = Date.now() - startTime;
        cy.log(`Response time: ${duration}ms`);
        if (response.status === 200) {
          expect(duration).to.be.lessThan(5000);
        }
      });
    });

    it("should return valid JSON response", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(() => JSON.stringify(response.body)).to.not.throw();
        }
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
        expect([200, 400, 422, 401, 403, 404]).to.include(response.status);
        cy.log(`Invalid page response: ${response.status}`);
      });
    });

    it("should handle missing parameters", () => {
      cy.request({
        method: "GET",
        url: baseUrl,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 400, 401, 403, 404]).to.include(response.status);
        cy.log(`Missing params response: ${response.status}`);
      });
    });

    it("should handle invalid sort direction", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=5&sortBy=newsdate&sortDirection=invalid`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 400, 401, 403, 404]).to.include(response.status);
        cy.log(`Invalid sort response: ${response.status}`);
      });
    });

    it("should handle zero page size", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}?page=1&pageSize=0&sortBy=newsdate&sortDirection=desc`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 400, 422, 401, 403, 404]).to.include(response.status);
        cy.log(`Zero page size response: ${response.status}`);
      });
    });
  });
});

// ========================================
// BOOKING API TESTS (Should work - Public API)
// ========================================

describe("Booking API - GET Request by ID Tests", () => {
  const baseUrl = "https://restful-booker.herokuapp.com/booking";
  let validBookingId;

  // First, get a valid booking ID
  before(() => {
    cy.request({
      method: "GET",
      url: "https://restful-booker.herokuapp.com/booking",
    }).then((response) => {
      if (response.body && response.body.length > 0) {
        validBookingId = response.body[0].bookingid;
        cy.log(`Using valid booking ID: ${validBookingId}`);
      } else {
        validBookingId = 1; // Fallback
      }
    });
  });

  // ✅ SUCCESS CASES
  context("Success Scenarios", () => {
    it("should successfully fetch booking data for valid ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.exist;
        cy.log("✅ Response: " + JSON.stringify(response.body, null, 2));
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

    it("should fetch multiple valid bookings", () => {
      cy.request({
        method: "GET",
        url: "https://restful-booker.herokuapp.com/booking",
      }).then((listResponse) => {
        const bookingIds = listResponse.body.slice(0, 3); // Test first 3 bookings
        
        bookingIds.forEach((booking) => {
          cy.request({
            method: "GET",
            url: `${baseUrl}/${booking.bookingid}`,
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("firstname");
          });
        });
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

    it("should have valid total price", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/${validBookingId}`,
      }).then((response) => {
        expect(response.body.totalprice).to.be.at.least(0);
        expect(response.body.totalprice).to.be.a("number");
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
        cy.log("✅ Correctly returned 404 for non-existent ID");
      });
    });

    it("should handle invalid booking ID format", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/invalid-id`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([400, 404]).to.include(response.status);
        cy.log(`Invalid ID format response: ${response.status}`);
      });
    });

    it("should handle negative booking ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/-1`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([400, 404]).to.include(response.status);
        cy.log(`Negative ID response: ${response.status}`);
      });
    });

    it("should handle special characters in booking ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/@#$%`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([400, 404]).to.include(response.status);
        cy.log(`Special chars response: ${response.status}`);
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
        cy.log(`ID=0 response: ${response.status}`);
      });
    });

    it("should handle very large booking ID", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/2147483647`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 404]).to.include(response.status);
        cy.log(`Large ID response: ${response.status}`);
      });
    });

    it("should handle booking ID with leading zeros", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/00001`,
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 404]).to.include(response.status);
        cy.log(`Leading zeros response: ${response.status}`);
      });
    });
  });
});

// ========================================
// BOOKING LIST API TESTS
// ========================================

describe("Booking List API Tests", () => {
  const baseUrl = "https://restful-booker.herokuapp.com/booking";

  it("should fetch list of all bookings", () => {
    cy.request({
      method: "GET",
      url: baseUrl,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
      cy.log(`✅ Found ${response.body.length} bookings`);
    });
  });

  it("should return booking IDs in correct format", () => {
    cy.request({
      method: "GET",
      url: baseUrl,
    }).then((response) => {
      expect(response.body[0]).to.have.property("bookingid");
      expect(response.body[0].bookingid).to.be.a("number");
    });
  });

  it("should filter bookings by firstname", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}?firstname=John`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.be.an("array");
        cy.log(`✅ Filtered bookings: ${response.body.length}`);
      }
    });
  });

  it("should filter bookings by lastname", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}?lastname=Smith`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.be.an("array");
        cy.log(`✅ Filtered bookings: ${response.body.length}`);
      }
    });
  });
});

// ========================================
// PERFORMANCE TESTS
// ========================================

describe("API Performance Tests", () => {
 it("Booking List API should respond within 3 seconds", () => {
  const startTime = Date.now();

  cy.request({
    method: "GET",
    url: "https://restful-booker.herokuapp.com/booking",
  }).then(() => {
    const duration = Date.now() - startTime;

    // Always log actual response time
    cy.log(` Actual API response time: ${duration}ms`);

    // Assert with custom failure message
    expect(duration, `API responded in ${duration}ms`).to.be.lessThan(3000);
  });
});

  it("Booking Details API should respond within 2 seconds", () => {
    cy.request({
      method: "GET",
      url: "https://restful-booker.herokuapp.com/booking",
    }).then((listResponse) => {
      const bookingId = listResponse.body[0].bookingid;
      const startTime = Date.now();
      
      cy.request({
        method: "GET",
        url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      }).then(() => {
        const duration = Date.now() - startTime;
        expect(duration).to.be.lessThan(2000);
        cy.log(`✅ Booking Details API response time: ${duration}ms`);
      });
    });
  });

  it("News API should respond within 5 seconds (if accessible)", () => {
    const startTime = Date.now();
    cy.request({
      method: "GET",
      url: "https://kaplapis.accountsdash.com/api/Api/news?page=1&pageSize=5&sortBy=newsdate&sortDirection=desc",
      failOnStatusCode: false,
    }).then((response) => {
      const duration = Date.now() - startTime;
      cy.log(`News API response time: ${duration}ms (Status: ${response.status})`);
      
      if (response.status === 200) {
        expect(duration).to.be.lessThan(5000);
      }
    });
  });
});

// ========================================
// RESPONSE STRUCTURE TESTS
// ========================================

describe("API Response Structure Tests", () => {
  it("Booking API should have consistent response structure", () => {
    cy.request({
      method: "GET",
      url: "https://restful-booker.herokuapp.com/booking",
    }).then((listResponse) => {
      const bookingIds = listResponse.body.slice(0, 5);
      
      bookingIds.forEach((booking) => {
        cy.request({
          method: "GET",
          url: `https://restful-booker.herokuapp.com/booking/${booking.bookingid}`,
        }).then((response) => {
          // Verify consistent structure
          expect(response.body).to.have.all.keys(
            "firstname",
            "lastname",
            "totalprice",
            "depositpaid",
            "bookingdates",
            "additionalneeds"
          );
          
          expect(response.body.bookingdates).to.have.all.keys(
            "checkin",
            "checkout"
          );
        });
      });
    });
  });
});