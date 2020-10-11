const { expect } = require('chai');
const { getRecommendationIncome } = require('../helpers/checkout.helper');

describe('Test Checkout helper', () => {
  it('Should be able to extract recommendations value', () => {
    const recommendations = [
      {
        status: 'open',
        currentlyReceived: ['first', 'second'],
        _id: '5f8382e183925a1f9c11e3d8',
        recommendee: {
          active: true,
          _id: '5f7c965d559b491614a803ca',
          email: 'thaysmariap19@gmail.com',
          fullName: 'Thaís Maria Maria',
          phoneNumber: '(32) 99904-5964'
        },
        recommended: {
          active: true,
          _id: '5f7c9652559b491614a80376',
          username: '12068976609',
          email: 'evinhamello99@gmail.com',
          fullName: 'Eva dos Santos Melo',
          cpf: '120.689.766-09',
          city: 'Carandaí',
          cep: '36280-000',
          phoneNumber: '(32) 99814-7027'
        },
        firstCheckout: 172,
        secondCheckout: 123,
        thirdCheckout: 738,
        createdAt: '2020-10-11T22:10:41.866Z',
        updatedAt: '2020-10-11T22:10:41.866Z',
        __v: 0
      }
    ];

    const expected = {
      list: [
        {
          recommendedFullName: 'Eva dos Santos Melo',
          checkoutOrder: 1,
          soldByRecommended: 738,
          consultantSplit: 36.9
        }
      ],
      totalSoldByRecomendations: 738,
      totalConsultantSplit: 36.9
    };

    expect(getRecommendationIncome(recommendations)).to.be.deep.equal(expected);
  });
});
