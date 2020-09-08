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

module.exports = {
  getConsultantLevel
};
