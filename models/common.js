const PieceSchema = {
  price: {
    type: Number,
    required: true,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  }
};

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

const StockSchema = {
  AN: [PieceSchema],
  BP: [PieceSchema],
  BG: [PieceSchema],
  CF: [PieceSchema],
  CM: [PieceSchema],
  PN: [PieceSchema],
  PF: [PieceSchema],
  PM: [PieceSchema],
  TZ: [PieceSchema],
  PZ: [PieceSchema],
  ES: [PieceSchema]
};

module.exports = {
  PieceSchema,
  StockSchema,
  emptyStock
};
