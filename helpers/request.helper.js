const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, inactive, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id)
      .populate({
        path: 'donoId',
        select: '_id nome sobrenome whatsapp endereco cidade cep cpf estoque'
      })
      .populate({
        path: 'products'
      });
    return instance;
  } else {
    let query = Model.find(otherParams)
      .populate({
        path: 'donoId',
        select: '_id nome sobrenome whatsapp endereco cidade cep cpf'
      })
      .populate({
        path: 'pagamento'
      });
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
