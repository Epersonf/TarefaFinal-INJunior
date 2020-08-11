const {
  emptyStock,
  sumStocks,
  subtractStocks,
  calculateTotals,
  aggregate
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

const stockD = {
  AN: [{ price: 10, quantity: 5 }],
  BP: [],
  BG: [],
  CF: [],
  CM: [
    { price: 20, quantity: 5 },
    { price: 10, quantity: 10 },
    { price: 15, quantity: 12 }
  ],
  PN: [],
  PF: [],
  PM: [],
  TZ: [],
  PZ: [],
  ES: [{ price: 20, quantity: 5 }]
};

const stockDAggregated = {
  AN: { price: 50, quantity: 5 },
  BP: { price: 0, quantity: 0 },
  BG: { price: 0, quantity: 0 },
  CF: { price: 0, quantity: 0 },
  CM: { price: 380, quantity: 27 },
  PN: { price: 0, quantity: 0 },
  PF: { price: 0, quantity: 0 },
  PM: { price: 0, quantity: 0 },
  TZ: { price: 0, quantity: 0 },
  PZ: { price: 0, quantity: 0 },
  ES: { price: 100, quantity: 5 },
  total: { price: 530, quantity: 37 }
};

const emptyAggregated = {
  AN: { price: 0, quantity: 0 },
  BP: { price: 0, quantity: 0 },
  BG: { price: 0, quantity: 0 },
  CF: { price: 0, quantity: 0 },
  CM: { price: 0, quantity: 0 },
  PN: { price: 0, quantity: 0 },
  PF: { price: 0, quantity: 0 },
  PM: { price: 0, quantity: 0 },
  TZ: { price: 0, quantity: 0 },
  PZ: { price: 0, quantity: 0 },
  ES: { price: 0, quantity: 0 },
  total: { price: 0, quantity: 0 }
};

const dSubtractor = {
  AN: [{ price: 10, quantity: 3 }],
  BP: [],
  BG: [],
  CF: [],
  CM: [
    { price: 20, quantity: 5 },
    { price: 10, quantity: 8 },
    { price: 15, quantity: 12 }
  ],
  PN: [],
  PF: [],
  PM: [],
  TZ: [],
  PZ: [],
  ES: [{ price: 20, quantity: 5 }]
};

const dResult = {
  AN: [{ price: 10, quantity: 2 }],
  BP: [],
  BG: [],
  CF: [],
  CM: [
    { price: 10, quantity: 2 },
  ],
  PN: [],
  PF: [],
  PM: [],
  TZ: [],
  PZ: [],
  ES: []
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
  describe('aggregate function', () => {
    it('Should return 0s if stock is empty', () => {
      const aggregatedResult = aggregate(emptyStock);
      expect(aggregatedResult).to.be.deep.equal(emptyAggregated);
    });
    it('Should get prices and quatities', () => {
      const aggregated = aggregate(stockD);
      expect(aggregated).to.be.deep.equal(stockDAggregated);
    });
  });
  describe('subtractStocks function', () => {
    it('Should subtract the pieces correctly', () => {
      const result = subtractStocks(stockD, dSubtractor);
      expect(result).to.be.deep.equal({
        result: dResult,
        status: 'done'
      });
    });
    it('Should the detect not possible subtraction', () => {
      const result = subtractStocks(dResult, stockD);
      expect(result).to.be.deep.equal({
        result: dSubtractor,
        status: 'missing'
      });
    });
  });
});
