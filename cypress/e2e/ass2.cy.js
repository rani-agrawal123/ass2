describe('SDET Assignment', () => {

  
  // 1. Apply waits for dynamic content
  // ===============================
  it('Wait until Hello World text is displayed', () => {
    cy.visit('https://the-internet.herokuapp.com/dynamic_loading/1');
    
    // Click Start button
    cy.get('#start button').click();

    // Wait for Hello World to be visible
    cy.get('#finish h4', { timeout: 10000 }) // explicit wait up to 10s
      .should('be.visible')
      .and('have.text', 'Hello World!');
  });

  
  // 2. Fetch values from web tables
  it('Fetch values from tables', () => {
    Cypress.config('defaultCommandTimeout', 5000);

    cy.visit('https://the-internet.herokuapp.com/tables');
    cy.get('#table1 tbody tr:nth-child(4) td:nth-child(3)')
      .invoke('text')
      .then((text) => {
        cy.log('Value from Table1 Row4 Col3: ' + text);
        expect(text.trim()).to.eq('$100.00');
      });

    // From second table (table id = table2) → 2nd row, last column
    cy.get('#table2 tbody tr:nth-child(2) td:last-child')
      .invoke('text')
      .then((text) => {
        cy.log('Value from Table2 Row2 LastCol: ' + text);
        expect(text.trim()).to.eq('http://www.frank.com');
      });
  });

  
  // 3. Handle new browser windows
  it('Handle new window and verify content', () => {
    cy.visit('https://the-internet.herokuapp.com/windows');

    // Remove target attribute so Cypress stays in same tab
    cy.get('.example a')
      .invoke('removeAttr', 'target')
      .click();

    // Verify new page URL and text
    cy.url().should('eq', 'https://the-internet.herokuapp.com/windows/new');
    cy.contains('New Window').should('be.visible');
  });

  // 4. Handle all JavaScript alerts
  it('Handle JS Alerts', () => {
    cy.visit('https://the-internet.herokuapp.com/javascript_alerts');

    // --- JS Alert ---
    cy.contains('Click for JS Alert').click();
    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('I am a JS Alert');
    });
    cy.get('#result').should('have.text', 'You successfully clicked an alert');

    // --- JS Confirm ---
    cy.contains('Click for JS Confirm').click();
    cy.on('window:confirm', (msg) => {
      expect(msg).to.equal('I am a JS Confirm');
      return true; // click OK
    });
    cy.get('#result').should('have.text', 'You clicked: Ok');

    // --- JS Prompt ---
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('SDET Assignment'); // enter text
    });
    cy.contains('Click for JS Prompt').click();
    cy.get('#result').should('have.text', 'You entered: SDET Assignment');
  });
});