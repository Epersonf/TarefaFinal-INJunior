const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, count, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id);
    return instance;
  } else {
    let query = Model.find(otherParams);
    sort && query.sort(sort);
    query.skip(skip ? Number(skip) : 0).limit(20);
    query.populate([
      {
        path: 'user',
        select: 'fullName adress phoneNumber active username email cpf city cep'
      },
      {
        path: 'supervisor',
        select: 'fullName adress phoneNumber active email'
      }
    ]);
    const collection = await query;
    const amount = (count) ? await query.count() : undefined;
    return { count: amount, elements: collection };
  }
};

module.exports = {
  handleGetFilters
};
