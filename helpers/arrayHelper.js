const removeFromArray = (fromCodeArray, codes) => {
    let missing = [];
    let codeArray = [...fromCodeArray];

    for(let i=0; i<codes.length; i++){
        //console.log(code);
        let idx = codeArray.indexOf(codes[i]);
        if (idx === -1) {
            missing.push(codes[i]);
        }
        else {
            codeArray.splice(idx, 1);
        }

    };
    return {
        status: missing.length === 0 ? 'done' : 'missing',
        items: missing.length === 0 ? codeArray : missing
    }
}

module.exports = {
    removeFromArray,
}