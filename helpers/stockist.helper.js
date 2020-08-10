const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, count, inactive, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id);
    return instance;
  } else {
    let query = Model.find(otherParams);
    if (count) {
      // TODO: Be able to count without inactive users
      query = query.count();
    } else {
      sort && (query = query.sort(sort));
      limit && (query = query.limit(Number(limit)));
      skip && (query = query.limit(Number(skip)));
    }
    query = query.populate([
      {
        path: 'user',
        select: 'fullName adress phoneNumber active username email cpf city cep'
      }
    ]);
    const collection = await query.exec();
    if (inactive || count) {
      return collection;
    } else {
      return collection.filter((supervisor) => supervisor.user.active === true);
    }
  }
};

module.exports = {
  handleGetFilters
};
