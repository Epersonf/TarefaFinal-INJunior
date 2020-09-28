const { ConsultantLevels } = require('../models/consultant.model');

const getConsultantLevel = (absoluteTotalSold) => {
  if (absoluteTotalSold < 2000) {
    return ConsultantLevels[0];
  } else if (absoluteTotalSold < 4000) {
    return ConsultantLevels[1];
  } else {
    return ConsultantLevels[2];
  }
};

const getConsultantLevelSplits = (absoluteSoldBefore, totalSold) => {
  let currentlySold = absoluteSoldBefore + totalSold;
  const split = [];
  if (absoluteSoldBefore <= 2000) {
    if (currentlySold - 4000 > 0) {
      const goldShare = currentlySold - 4000;
      split.push({
        level: ConsultantLevels[2],
        splitPercentage: 30,
        valueforLevel: goldShare,
        splitForLevel: goldShare * 0.3
      });
      currentlySold = currentlySold - goldShare;
    }
    if (currentlySold - 2000 > 0) {
      const silverShare = currentlySold - 2000;
      split.push({
        level: ConsultantLevels[1],
        splitPercentage: 25,
        valueforLevel: silverShare,
        splitForLevel: silverShare * 0.25
      });
      currentlySold = currentlySold - silverShare;
    }
    if (currentlySold - absoluteSoldBefore > 0) {
      const bronzeShare = currentlySold - absoluteSoldBefore;
      split.push({
        level: ConsultantLevels[0],
        splitPercentage: 20,
        valueforLevel: bronzeShare,
        splitForLevel: bronzeShare * 0.2
      });
    }
  } else if (absoluteSoldBefore <= 4000) {
    if (currentlySold - 4000 > 0) {
      const goldShare = currentlySold - 4000;
      split.push({
        level: ConsultantLevels[2],
        splitPercentage: 30,
        valueforLevel: goldShare,
        splitForLevel: goldShare * 0.3
      });
      currentlySold = currentlySold - goldShare;
    }
    if (currentlySold - absoluteSoldBefore > 0) {
      const silverShare = currentlySold - absoluteSoldBefore;
      split.push({
        level: ConsultantLevels[1],
        splitPercentage: 25,
        valueforLevel: silverShare,
        splitForLevel: silverShare * 0.25
      });
    }
  } else {
    const goldShare = currentlySold - absoluteSoldBefore;
    split.push({
      level: ConsultantLevels[2],
      splitPercentage: 30,
      valueforLevel: goldShare,
      splitForLevel: goldShare * 0.3
    });
  }
  return split;
};

module.exports = {
  getConsultantLevel,
  getConsultantLevelSplits
};
