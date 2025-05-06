describe('Dodawanie przetargu', () => {
    it('Dodaje przetarg poprawnie', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');
        cy.get('form').submit();

        cy.contains('Nowy przetarg testowy'); // asercja 1
        cy.contains('czwartek, 1.05.2025, 12:00');    // asercja 2
        cy.contains('niedziela, 1.06.2025, 20:00');    // asercja 2
    });

    it('Nie dodaje przetargu bez tytułu', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('10000');
        cy.get('form').submit();
    
        // Sprawdzamy, czy pojawił się komunikat o błędzie
        cy.contains('Tytuł jest wymagany').should('be.visible');
      });
});