describe('Добавление ингредиентов из списка в конструктор', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('http://localhost:4000');
  });

  it('Добавляем булку в конструктор', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';
    const bunName = 'Краторная булка N-200i';
    cy.get(`[data-cy="${bunId}"]`)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click();

    cy.get(`[data-cy-btop^=${bunId}]`).contains(bunName);
    cy.get(`[data-cy-bbottom^=${bunId}]`).contains(bunName);
  });

  it('Добавляем ингредиент и соус в конструктор', () => {
    const ingredientId = '643d69a5c3f7b9001cfa0948';
    const ingredientName = 'Кристаллы марсианских альфа-сахаридов';
    const sauceId = '643d69a5c3f7b9001cfa0942';
    const sauceName = 'Соус Spicy-X';
    cy.get(`[data-cy="${ingredientId}"]`)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get(`[data-cy-ingredient^=${ingredientId}]`).contains(ingredientName);

    cy.get(`[data-cy="${sauceId}"]`)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get(`[data-cy-ingredient^=${sauceId}]`).contains(sauceName);
  });
});
