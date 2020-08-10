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
  StockSchema
};
