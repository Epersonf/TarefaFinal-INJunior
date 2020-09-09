const { checkGiftsForCampaing } = require('../helpers/gift.helper');
const { expect } = require('chai');

const accumulativeCampaing = {
  name: 'accumulative',
  goalValue: 1000,
  accumulative: true,
  maxQuantity: undefined
};

const notAccumulativeCampaing = {
  name: 'accumulative',
  goalValue: 1000,
  accumulative: false,
  maxQuantity: undefined
};

describe('Testing gift helper', () => {
  it('Check gifts for accumulative campaing', () => {
    const numberOfGifts1 = checkGiftsForCampaing(accumulativeCampaing, 0, 2000);
    const numberOfGifts2 = checkGiftsForCampaing(accumulativeCampaing, 0, 953);
    const numberOfGifts3 = checkGiftsForCampaing(
      accumulativeCampaing,
      1232,
      4520,
      2
    );
    const numberOfGifts4 = checkGiftsForCampaing(
      accumulativeCampaing,
      930,
      3105
    );

    expect(numberOfGifts1).to.equal(2);
    expect(numberOfGifts2).to.equal(0);
    expect(numberOfGifts3).to.equal(2);
    expect(numberOfGifts4).to.equal(3);
  });
  it('Check gifts for no accumulative campaing', () => {
    const numberOfGifts1 = checkGiftsForCampaing(
      notAccumulativeCampaing,
      0,
      2000
    );
    const numberOfGifts2 = checkGiftsForCampaing(
      notAccumulativeCampaing,
      0,
      953
    );
    const numberOfGifts3 = checkGiftsForCampaing(
      notAccumulativeCampaing,
      1232,
      4520
    );
    const numberOfGifts4 = checkGiftsForCampaing(
      notAccumulativeCampaing,
      930,
      3105
    );

    expect(numberOfGifts1).to.equal(1);
    expect(numberOfGifts2).to.equal(0);
    expect(numberOfGifts3).to.equal(1);
    expect(numberOfGifts4).to.equal(1);
  });
});
