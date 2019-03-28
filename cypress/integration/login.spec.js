let myApp = 'http://localhost:3001/';
// Visit My App
describe('clicks on Login', function() {
  it('clicks on Login', function() {
    cy.visit(myApp);
    cy.contains('Login');
    cy.url().should('include', '/');
  });
});

// Provide Valid username and password to accept login
describe("types 'joHny12' into Returning User username field", function() {
  it("types 'joHny12' into Returning User username field", function() {
    cy.visit(myApp);
    cy.get('input:first')
      .should('have.attr', 'placeholder', 'Username')
      .type('joHny12');
    cy.get('input:last')
      .should('have.attr', 'placeholder', 'Password')
      .type('Abcd1234');
    cy.get('form').submit();
  });
});

//Provide wrong userid and password and expect error message text window
describe("types 'john' into  username field and expect error message text", function() {
  it("types 'john' into Returning User username field", function() {
    cy.visit(myApp);
    cy.get('input:first')
      .should('have.attr', 'placeholder', 'Username')
      .type('john');
    cy.get('input:last')
      .should('have.attr', 'placeholder', 'Password')
      .type('abcd');
    cy.get('form').submit();
    cy.contains('Invalid username and/or password');
  });
});

// Register Form sign up tests----
describe("user can't submit Register form without valid username", function() {
  it('displays form validation', function() {
    cy.visit(myApp);
    cy.contains('here').click();
    cy.url().should('include', '/');

    cy.get('[data-cy=usernameField]').type('john');
    cy.get('[data-cy=passwordField]').type('john');

    cy.get('[data-cy=registerButton]').click();
    cy.contains('Username should contain min six letters . e.g. joHn12');
  });
});

describe("user can't submit Register form without valid password", function() {
  it('displays form validation', function() {
    cy.visit(myApp);
    cy.contains('here').click();
    cy.url().should('include', '/');
    cy.get('[data-cy=usernameField]').clear();
    cy.get('[data-cy=passwordField]').clear();
    cy.get('[data-cy=usernameField]').type('Abc12344');
    cy.get('[data-cy=passwordField]').type('john');

    cy.get('[data-cy=registerButton]').click();
    cy.contains(
      'Password should contain Minimum eight characters, at least one letter (one uppercase must) and one number'
    );
  });
});

describe('user can submit Register form with valid username and password', function() {
  it('displays form validation', function() {
    cy.visit(myApp);
    cy.contains('here').click();
    cy.url().should('include', '/');
    cy.get('[data-cy=usernameField]').clear();
    cy.get('[data-cy=passwordField]').clear();
    cy.get('[data-cy=usernameField]').type('BBcD1234');
    cy.get('[data-cy=passwordField]').type('johnAb12348');

    cy.get('[data-cy=registerButton]').click();
    // cy.contains(
    //   'Password should contain Minimum eight characters, at least one letter (one uppercase must) and one number'
    // );
    cy.url().should('include', 'http://localhost:3001/dashboard');
  });
});
