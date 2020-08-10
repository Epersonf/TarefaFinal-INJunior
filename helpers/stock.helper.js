const pieceTypes = [
  { sigla: 'AN', label: 'anel', pural: 'anéis' },
  { sigla: 'BP', label: 'brinco pequeno', pural: 'brincos pequenos' },
  { sigla: 'BG', label: 'brinco grande', pural: 'brincos grandes' },
  { sigla: 'CF', label: 'cordão feminino', pural: 'cordões femininos' },
  { sigla: 'CM', label: 'cordão masculino', pural: 'cordões masculinos' },
  { sigla: 'PN', label: 'pingente', pural: 'pingentes' },
  { sigla: 'PF', label: 'pulseira feminina', pural: 'pulseiras femininas' },
  { sigla: 'PM', label: 'pulseira masculina', pural: 'pulseiras masculinas' },
  { sigla: 'TZ', label: 'tornozeleira', pural: 'tornozeleiras' },
  { sigla: 'PZ', label: 'personalizada', pural: 'personalizadas' },
  { sigla: 'ES', label: 'escapulário', pural: 'escapulários' }
];

const emptyStock = {
  AN: [],
  BP: [],
  BG: [],
  CF: [],
  CM: [],
  PN: [],
  PF: [],
  PM: [],
  TZ: [],
  PZ: [],
  ES: []
};

const calculateTotals = (piecesArray) => {
  return piecesArray.reduce(
    (totals, piece) => {
      return {
        price: totals.price + piece.price * piece.quantity,
        quantity: totals.quantity + piece.quantity
      };
    },
    { price: 0, quantity: 0 }
  );
};

const aggregate = (stock) => {
  const pieceCodes = Object.keys(stock);
  const perCode = pieceCodes.reduce((aggregated, code) => {
    aggregated[code] = calculateTotals(stock[code]);
    return aggregated;
  }, {});
  perCode.total = Object.keys(perCode).reduce(
    (totals, code) => {
      return {
        price: totals.price + perCode[code].price,
        quantity: totals.quantity + perCode[code].quantity
      };
    },
    { price: 0, quantity: 0 }
  );
  return perCode;
};

const sumStocks = (stockA, stockB) => {
  const sum = emptyStock;
  pieceTypes.forEach((type) => {
    const sumArray = [...stockA[type.sigla], ...stockB[type.sigla]];
    sum[type.sigla] = sumArray.reduce((result, piece) => {
      const found = result.findIndex(
        (resultPiece) => resultPiece.price === piece.price
      );
      if (found === -1) {
        result = [...result, piece];
      } else {
        result[found].quantity += piece.quantity;
      }
      return result;
    }, []);
  });
  return sum;
};

module.exports = {
  pieceTypes,
  emptyStock,
  calculateTotals,
  aggregate,
  sumStocks
};
