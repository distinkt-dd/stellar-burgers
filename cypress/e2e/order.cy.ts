describe('Тесты создания заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    window.localStorage.setItem('refreshToken', 'test-refresh');
    cy.setCookie('accessToken', 'test-access');
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Создаем заказ', () => {
    // добавил булку
    const bunId = '643d69a5c3f7b9001cfa093c';
    const bunName = 'Краторная булка N-200i';
    cy.get(`[data-cy="${bunId}"]`)
      .parents('li')
      .find('button')
      .contains('Добавить')
      .click();

    cy.get(`[data-cy-btop^=${bunId}]`).contains(bunName);
    cy.get(`[data-cy-bbottom^=${bunId}]`).contains(bunName);

    // добавил ингредиент и соус
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

    // КНОПКА заказа

    cy.get('[data-cy="order-button"]').contains('Оформить заказ').click();
    cy.wait('@createOrder');
    cy.get(`[data-cy="modal"]`).should('be.visible');
    cy.get('[data-cy="order-number"]').contains('98917');
    cy.get(`[data-cy="modal-close-btn"]`).click();

    cy.get(`[data-cy-btop]`).should('contain.text', 'Выберите булки');
    cy.get(`[data-cy-ingredient]`).should('contain.text', 'Выберите начинку');
    cy.get(`[data-cy-bbottom]`).should('contain.text', 'Выберите булки');
  });
});
