const groupPrices = (pieces) => {
    pieces = pieces.reduce((newPieces, piece) => {
        let found = newPieces.find(newPiece => newPiece.price === piece.price);
        if (!found) {
            piece.quantity = 1;
            newPieces.push(piece);
        } else {
            found.quantity++;
        }
        return newPieces;
    }, []);
    pieces.sort((a, b) => a.price > b.price);
    return pieces;
}

module.exports = {
    groupPrices,
}