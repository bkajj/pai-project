const { setCurrentTime } = require('../../models/Tender.js');

describe('Dodawanie przetargu', () => {
    it('Dodanie przetargu, ofert i jego zakonczenie', () => {
        const now = new Date();
        const future = new Date(now.getTime() + 120 * 1000);
        const afterEnd = new Date(future.getTime() + 10 * 60 * 1000); 

        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Przetarg czasowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type(formatDateLocal(now));
        cy.get('input[name="end"]').type(formatDateLocal(future));
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();
        cy.contains('Przetarg czasowy').should('be.visible').click();

        cy.get('input[name="bidder_name"]').type('Jan Kowalski');
        cy.get('input[name="offer_value"]').type('50000');
        cy.get('button[type="submit"]').click();

        cy.contains('Najkorzystniejsze oferty').should('be.visible');
        cy.contains('Jan Kowalski').should('be.visible');
        cy.contains('50000.00 zł').should('be.visible');

        cy.visit('/tenders');
        cy.request('POST', '/__test/set-time', {
            time: afterEnd.toISOString(),
          });
        cy.visit('/tenders/finished');
        cy.contains('Przetarg czasowy').should('be.visible').click();

        cy.contains('Złóż ofertę').should('not.exist');
        cy.contains('Przetarg zakończony').should('be.visible');
        cy.contains('Najkorzystniejsze oferty').should('be.visible');
        cy.contains('Jan Kowalski').should('be.visible');
        cy.contains('50000.00 zł').should('be.visible');

        cy.request('POST', '/__test/set-time', {
            time: new Date().toISOString(),
          });
    });

    it('Poprawne dodanie', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();

        cy.contains('Nowy przetarg testowy');
        cy.contains('czwartek, 1.05.2025, 12:00');
        cy.contains('niedziela, 1.06.2025, 20:00');
    });

    it('Poprawne dodanie z detelami', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg z detalami');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();
        cy.contains('Nowy przetarg z detalami').click();

        cy.contains('Nowy przetarg z detalami').should('be.visible');
        cy.contains('Testowa Instytucja').should('be.visible');
        cy.contains('Opis testowy').should('be.visible');
        cy.contains('100000.00 zł').should('be.visible');
        cy.contains('czwartek, 1.05.2025, 12:00').should('be.visible');
        cy.contains('niedziela, 1.06.2025, 20:00').should('be.visible');
    });

    it('Przetarg bez tytułu', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('10000');

        cy.get('button[type="submit"]').click();
    
        cy.get('input[name="title"]')
        .should('have.prop', 'validity')
        .and('have.property', 'valueMissing', true);
    });

    it('Przetarg bez instytucji', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testowy');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('10000');

        cy.get('button[type="submit"]').click();
    
        cy.get('input[name="institution"]')
        .should('have.prop', 'validity')
        .and('have.property', 'valueMissing', true);
    });

    it('Przetarg bez opisu', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('10000');

        cy.get('button[type="submit"]').click();
    
        cy.get('textarea[name="description"]')
        .should('have.prop', 'validity')
        .and('have.property', 'valueMissing', true);
    });

    it('Przetarg bez daty start', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('10000');

        cy.get('button[type="submit"]').click();
    
        cy.get('input[name="start"]')
        .should('have.prop', 'validity')
        .and('have.property', 'valueMissing', true);
    });

    it('Przetarg bez daty end', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="max_budget"]').type('10000');

        cy.get('button[type="submit"]').click();
    
        cy.get('input[name="end"]')
        .should('have.prop', 'validity')
        .and('have.property', 'valueMissing', true);
    });

    it('Przetarg bez budzetu', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg testowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');

        cy.get('button[type="submit"]').click();
    
        cy.get('input[name="max_budget"]')
        .should('have.prop', 'validity')
        .and('have.property', 'valueMissing', true);
    });

    it('Przetarg z ujemnym budzetem', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg ujemny');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('-100000');

        cy.get('button[type="submit"]').click();

        cy.get('input[name="max_budget"]')
        .should('have.prop', 'validity')
        .and('have.property', 'rangeUnderflow', true);

    });

    it('Przetarg z ujemnym zerowym', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg zerowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-05-01T12:00');
        cy.get('input[name="end"]').type('2025-06-01T20:00');
        cy.get('input[name="max_budget"]').type('0');

        cy.get('button[type="submit"]').click();

        cy.contains('Nowy przetarg zerowy').should('be.visible');
    });

    it('Przetarg z odwrotna data', () => {
        cy.visit('/tenders/add');
        cy.get('input[name="title"]').type('Nowy przetarg datowy');
        cy.get('input[name="institution"]').type('Testowa Instytucja');
        cy.get('textarea[name="description"]').type('Opis testowy');
        cy.get('input[name="start"]').type('2025-06-01T12:00');
        cy.get('input[name="end"]').type('2025-05-01T20:00');
        cy.get('input[name="max_budget"]').type('100000');

        cy.get('button[type="submit"]').click();

        cy.get('input[name="end"]')
        .should('have.prop', 'validity')
        .and('have.property', 'rangeUnderflow', true);
    });

    
});

function formatDateLocal(date) {
    const pad = n => n.toString().padStart(2, '0');
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }