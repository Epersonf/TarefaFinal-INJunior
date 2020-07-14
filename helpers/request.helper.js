const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, inactive, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id);
    return instance;
  } else {
    let query = Model.find(otherParams);
    !inactive && (query = query.find({ active: true }));
    sort && (query = query.sort(sort));
    limit && (query = query.limit(Number(limit)));
    skip && (query = query.limit(Number(skip)));
    const collection = await query.exec();
    return collection;
  }
};

module.exports = {
  handleGetFilters
};
