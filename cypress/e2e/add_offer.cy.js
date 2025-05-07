describe('Dodawanie oferty', () => {
    it('Poprawne dodanie oferty', () => {
        cy.visit('/tenders/1');
        cy.get('input[name="bidder_name"]').type('Jan Kowalski');
        cy.get('input[name="offer_value"]').type('50000');
        cy.get('button[type="submit"]').click();

        cy.contains('Jan Kowalski').should('be.visible');
    });

    it('Oferta ponad budzet', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testujacy oferty');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();
        cy.contains('Nowy przetarg testujacy oferty').click();

        cy.get('input[name="bidder_name"]').type('Jan Kowalski');
        cy.get('input[name="offer_value"]').type('200000');
        cy.get('button[type="submit"]').click();

        cy.contains('Najtańsze oferty').should('be.visible');
        cy.contains('Jan Kowalski').should('be.visible');
        cy.contains('200000.00 zł').should('be.visible');
    });

    it('Oferta ponizej budzetu', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testujacy oferty 2');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();
        cy.contains('Nowy przetarg testujacy oferty 2').click();

        cy.get('input[name="bidder_name"]').type('Kamil Janowski');
        cy.get('input[name="offer_value"]').type('50000');
        cy.get('button[type="submit"]').click();

        cy.contains('Najkorzystniejsze oferty').should('be.visible');
        cy.contains('Kamil Janowski').should('be.visible');
        cy.contains('50000.00 zł').should('be.visible');
    });

    it('Oferta rowna budzetowi', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testujacy oferty 3');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();
        cy.contains('Nowy przetarg testujacy oferty 3').click();

        cy.get('input[name="bidder_name"]').type('Jamil Kanowski');
        cy.get('input[name="offer_value"]').type('100000');
        cy.get('button[type="submit"]').click();

        cy.contains('Najkorzystniejsze oferty').should('be.visible');
        cy.contains('Jamil Kanowski').should('be.visible');
        cy.contains('100000.00 zł').should('be.visible');
    });

    it('Oferta ponad budzet, nastepnie oferta ponizej budzetu', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testujacy oferty kolejno');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();
        cy.contains('Nowy przetarg testujacy oferty kolejno').click();

        cy.get('input[name="bidder_name"]').type('Jamil Kanowski');
        cy.get('input[name="offer_value"]').type('200000');
        cy.get('button[type="submit"]').click();

        cy.contains('Najtańsze oferty').should('be.visible');
        cy.contains('Jamil Kanowski').should('be.visible');
        cy.contains('200000.00 zł').should('be.visible');

        cy.get('input[name="bidder_name"]').type('Tani Jarek');
        cy.get('input[name="offer_value"]').type('50000');
        cy.get('button[type="submit"]').click();

        cy.contains('Najkorzystniejsze oferty').should('be.visible');
        cy.contains('Tani Jarek').should('be.visible');
        cy.contains('50000.00 zł').should('be.visible');
    });

    it('Oferta ponizej budzetu, nastepnie oferta ponad budzet', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testujacy oferty kolejno 2');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();
        cy.contains('Nowy przetarg testujacy oferty kolejno 2').click();

        cy.get('input[name="bidder_name"]').type('Tani Jarek');
        cy.get('input[name="offer_value"]').type('50000');
        cy.get('button[type="submit"]').click();

        cy.contains('Najkorzystniejsze oferty').should('be.visible');
        cy.contains('Tani Jarek').should('be.visible');
        cy.contains('50000.00 zł').should('be.visible');

        cy.get('input[name="bidder_name"]').type('Jamil Kanowski');
        cy.get('input[name="offer_value"]').type('200000');
        cy.get('button[type="submit"]').click();

        cy.contains('Najkorzystniejsze oferty').should('be.visible');
        cy.contains('Jamil Kanowski').should('not.exist');
        cy.contains('200000.00 zł').should('not.exist');

        
    });

    it('Oferta bez nazwy oferenta', () => {
        cy.visit('/tenders/1');
        cy.get('input[name="offer_value"]').type('50000');

        cy.get('button[type="submit"]').click();
    
        cy.get('input[name="bidder_name"]')
        .should('have.prop', 'validity')
        .and('have.property', 'valueMissing', true);
    });

    it('Oferta bez wartosci oferty', () => {
        cy.visit('/tenders/1');
        cy.get('input[name="bidder_name"]').type('Jan Nowak');

        cy.get('button[type="submit"]').click();
    
        cy.get('input[name="offer_value"]')
        .should('have.prop', 'validity')
        .and('have.property', 'valueMissing', true);
    });

    it('Oferta z wartoscia ujemna', () => {
        cy.visit('/tenders/1');
        cy.get('input[name="bidder_name"]').type('Jan Kowalski');
        cy.get('input[name="offer_value"]').type('-50000');

        cy.get('button[type="submit"]').click();
    
        cy.get('input[name="offer_value"]')
        .should('have.prop', 'validity')
        .and('have.property', 'rangeUnderflow', true);
    });

    it('Oferta z wartoscia zero', () => {
        cy.visit('/tenders/1');
        cy.get('input[name="bidder_name"]').type('Kamil Nowacki');
        cy.get('input[name="offer_value"]').type('0');

        cy.get('button[type="submit"]').click();
    
        cy.contains('Kamil Nowacki').should('be.visible');
    });
});