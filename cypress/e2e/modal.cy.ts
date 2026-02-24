describe('Тестирование открытия модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('Клик по ингредиенту и закрытие на крестик', () => {
    const ingredientId = '643d69a5c3f7b9001cfa0948';
    cy.get(`[data-cy="${ingredientId}"]`).click();
    cy.get(`[data-cy="modal"]`).should('be.visible');
    cy.get('[data-cy="modal-close-btn"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Клик по ингредиенту и закрытие на оверлей', () => {
    const ingredientId = '643d69a5c3f7b9001cfa0948';
    cy.get(`[data-cy="${ingredientId}"]`).click();
    cy.get(`[data-cy="modal"]`).should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
