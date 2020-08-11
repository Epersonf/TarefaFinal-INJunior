const {
  emptyStock,
  sumStocks,
  calculateTotals
} = require('../helpers/stock.helper');
const { expect } = require('chai');

const stockA = {
  AN: [{ price: 10, quantity: 5 }],
  BP: [],
  BG: [],
  CF: [],
  CM: [],
  PN: [],
  PF: [],
  PM: [],
  TZ: [],
  PZ: [],
  ES: []
};

const stockB = {
  AN: [],
  BP: [],
  BG: [],
  CF: [],
  CM: [],
  PN: [],
  PF: [],
  PM: [],
  TZ: [],
  PZ: [],
  ES: [{ price: 20, quantity: 5 }]
};

const stockC = {
  AN: [{ price: 10, quantity: 5 }],
  BP: [],
  BG: [],
  CF: [],
  CM: [],
  PN: [],
  PF: [],
  PM: [],
  TZ: [],
  PZ: [],
  ES: [{ price: 20, quantity: 5 }]
};

describe('Testing Stock helper', () => {
  describe('Sum stock function', () => {
    it('Should sum to an empty stock', () => {
      const result = sumStocks(emptyStock, stockA);
      expect(result).to.be.deep.equal(stockA);
    });
    it('Should sum different prices and respect sum rules', () => {
      const resultA = sumStocks(stockB, stockA);
      const resultB = sumStocks(stockA, stockB);
      expect(resultA).to.be.deep.equal(resultB);
      expect(resultA).to.be.deep.equal(stockC);
    });
    it('Should sum equal prices and respect sum rules', () => {
      const result = sumStocks(stockA, stockC);
      const expectedResult = {
        AN: [{ price: 10, quantity: 10 }],
        BP: [],
        BG: [],
        CF: [],
        CM: [],
        PN: [],
        PF: [],
        PM: [],
        TZ: [],
        PZ: [],
        ES: [{ price: 20, quantity: 5 }]
      };
      expect(result).to.be.deep.equal(expectedResult);
    });
  });
  describe('calculateTotals function', () => {
    it('Should return 0s if array is empty', () => {
      const totals = calculateTotals([]);
      const expectedTotals = { price: 0, quantity: 0 };
      expect(totals).to.be.deep.equal(expectedTotals);
    });
    it('Should the prices and the quatities', () => {
      const totals = calculateTotals([
        { price: 20, quantity: 5 },
        { price: 10, quantity: 10 },
        { price: 15, quantity: 12 }
      ]);
      const expectedTotals = { price: 380, quantity: 27 };
      expect(totals).to.be.deep.equal(expectedTotals);
    });
  });
});
