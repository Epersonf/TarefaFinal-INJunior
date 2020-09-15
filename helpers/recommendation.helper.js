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
      query = query.populate([
        {
          path: 'recommended',
          select:
            'fullName adress phoneNumber active username email cpf city cep'
        },
        {
          path: 'recommendee',
          select: 'fullName adress phoneNumber active email'
        }
      ]);
    }

    const collection = await query.exec();
    return collection;
  }
};

module.exports = {
  handleGetFilters
};
