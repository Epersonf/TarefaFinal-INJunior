const {
  getConsultantLevel,
  getConsultantLevelSplits
} = require('../helpers/level.helper');
const { expect } = require('chai');

describe('Testing Level helper', () => {
  describe('Get consultant level function', () => {
    it('Should return bronze for values up to 2000', () => {
      const sold1 = 300;
      const sold2 = 1236;
      const sold3 = 1999;

      const level1 = getConsultantLevel(sold1);
      const level2 = getConsultantLevel(sold2);
      const level3 = getConsultantLevel(sold3);

      expect(level1).to.be.equals('bronze');
      expect(level2).to.be.equals('bronze');
      expect(level3).to.be.equals('bronze');
    });
    it('Should return bronze for values up to 2000', () => {
      const sold1 = 2000;
      const sold2 = 3146;
      const sold3 = 3999;

      const level1 = getConsultantLevel(sold1);
      const level2 = getConsultantLevel(sold2);
      const level3 = getConsultantLevel(sold3);

      expect(level1).to.be.equals('silver');
      expect(level2).to.be.equals('silver');
      expect(level3).to.be.equals('silver');
    });
    it('Should return bronze for values up to 2000', () => {
      const sold1 = 4000;
      const sold2 = 7562;
      const sold3 = 27364;

      const level1 = getConsultantLevel(sold1);
      const level2 = getConsultantLevel(sold2);
      const level3 = getConsultantLevel(sold3);

      expect(level1).to.be.equals('gold');
      expect(level2).to.be.equals('gold');
      expect(level3).to.be.equals('gold');
    });
  });
  describe('Get consultant level split function', () => {
    it('Should return just one split for simple bronze consultant first checkout', () => {
      const split = getConsultantLevelSplits(0, 753);
      const expectedSplit = [
        {
          level: 'bronze',
          splitPercentage: 20,
          valueforLevel: 753,
          splitForLevel: 753 * 0.2
        }
      ];
      expect(split).to.be.deep.equals(expectedSplit);
    });
    it('Should return just one split for simple bronze consultant not first checkout', () => {
      const split = getConsultantLevelSplits(453, 1532);
      const expectedSplit = [
        {
          level: 'bronze',
          splitPercentage: 20,
          valueforLevel: 1532,
          splitForLevel: 1532 * 0.2
        }
      ];
      expect(split).to.be.deep.equals(expectedSplit);
    });
    it('Should return just two splits for bronze to silver consultant', () => {
      const split = getConsultantLevelSplits(1500, 1320);
      const expectedSplit = [
        {
          level: 'silver',
          splitPercentage: 25,
          valueforLevel: 820,
          splitForLevel: 820 * 0.25
        },
        {
          level: 'bronze',
          splitPercentage: 20,
          valueforLevel: 500,
          splitForLevel: 500 * 0.2
        }
      ];
      expect(split).to.be.deep.equals(expectedSplit);
    });
    it('Should return just one splits for silver consultant', () => {
      const split = getConsultantLevelSplits(2000, 1320);
      const expectedSplit = [
        {
          level: 'silver',
          splitPercentage: 25,
          valueforLevel: 1320,
          splitForLevel: 1320 * 0.25
        }
      ];
      expect(split).to.be.deep.equals(expectedSplit);
    });
    it('Should return just two splits for silver to gold consultant', () => {
      const split = getConsultantLevelSplits(3250, 1320);
      const expectedSplit = [
        {
          level: 'gold',
          splitPercentage: 30,
          valueforLevel: 570,
          splitForLevel: 570 * 0.3
        },
        {
          level: 'silver',
          splitPercentage: 25,
          valueforLevel: 750,
          splitForLevel: 750 * 0.25
        }
      ];
      expect(split).to.be.deep.equals(expectedSplit);
    });
    it('Should return just one splits for gold consultant', () => {
      const split = getConsultantLevelSplits(4250, 1320);
      const expectedSplit = [
        {
          level: 'gold',
          splitPercentage: 30,
          valueforLevel: 1320,
          splitForLevel: 1320 * 0.3
        }
      ];
      expect(split).to.be.deep.equals(expectedSplit);
    });
  });
});
