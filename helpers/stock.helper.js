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
  const sum = { ...emptyStock };
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

const subtractStocks = (stock, subtractor) => {
  const result = { ...emptyStock };
  const missing = { ...emptyStock };
  pieceTypes.forEach((type) => {
    subtractor[type.sigla].forEach((subtractorPiece) => {
      const stockPiece = stock[type.sigla].find(
        (piece) => piece.price === subtractorPiece.price
      );
      if (!stockPiece) {
        missing[type.sigla].push(subtractorPiece);
      } else {
        if (stockPiece.quantity > subtractorPiece.quantity) {
          result[type.sigla] = [
            ...result[type.sigla],
            {
              price: stockPiece.price,
              quantity: stockPiece.quantity - subtractorPiece.quantity
            }
          ];
        } else if (stockPiece.quantity < subtractorPiece.quantity) {
          missing[type.sigla] = [
            ...missing[type.sigla],
            {
              price: stockPiece.price,
              quantity: subtractorPiece.quantity - stockPiece.quantity
            }
          ];
        }
      }
    });
  });
  const status = aggregate(missing).total.quantity === 0 ? 'done' : 'missing';
  return {
    status,
    result: status === 'done' ? result : missing
  };
};

module.exports = {
  pieceTypes,
  emptyStock,
  calculateTotals,
  aggregate,
  sumStocks,
  subtractStocks
};
