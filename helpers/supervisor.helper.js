const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, count, inactive, ...otherParams } = query;
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
    }
    query = query.populate([
      {
        path: 'user',
        select: 'fullName adress phoneNumber active username email cpf city cep'
      },
      {
        path: 'supervisor',
        select: 'fullName adress phoneNumber active'
      }
    ]);
    const collection = await query.exec();
    if (inactive || count) {
      return collection;
    } else {
      return collection.filter((consultant) => consultant.user.active === true);
    }
  }
};

module.exports = {
  handleGetFilters
};