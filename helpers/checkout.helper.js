const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, count, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id);
    return instance;
  } else {
    let query = Model.find(otherParams);
    if (count) {
      query = query.count();
    } else {
      sort && (query = query.sort(sort));
      limit && (query = query.limit(Number(limit)));
      skip && (query = query.limit(Number(skip)));
      query = query.populate({
        path: 'sellings'
      });
      query = query.populate({
        path: 'gifts'
      });
    }

    const collection = await query.exec();
    return collection;
  }
};

const closeCheckout = async () => {
  // sum sellings
  // sum pieceReplacement differences
  // sum absoluteSold to absoluteSoldBefore
  // verify absoluteSold from user
  // sum value from recomendations to newAbsoluteSold
  // update new absoluteSold for user
  // update recommendations taken
  // update checkout for closed
  // create new checkout for user
};

module.exports = {
  handleGetFilters,
  closeCheckout
};
