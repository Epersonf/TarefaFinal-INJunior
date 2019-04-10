
var config = require('../config');
const fetch = require("node-fetch");
var xml2js = require('xml2js-es6-promise');

const authenticate = async () => {
    var url;
    if (config.useSandbox) {
        url = `https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=${config.pagseguroEmail}&token=${config.pagseguroSandboxToken}`
    } else {
        url = `https://ws.pagseguro.uol.com.br/v2/sessions?email=${config.pagseguroEmail}&token=${config.pagSeguroToken}`
    }
    const response = await fetch(url, { method: 'POST' });
    const sessionString = await response.text();
    const session = await xml2js(sessionString);
    console.info(`Authenticated:`, session)
    return session;
}

const newBoleto = (payment, user, senderHash) => {
    let boleto = {
        paymentMode: 'default',
        paymentMethod: 'boleto',
        receiverEmail: config.pagseguroEmail,
        currency: 'BRL',
        extraAmount: '0.00',
        itemId1: '01',
        itemDescription1: payment.pecas[0]=='enxoval' ? 'Enxoval' : 'Peças',
        itemAmount1: Number(payment.pago).toFixed(2),
        itemQuantity1: payment.pecas.length,
        notificationURL: config.pagseguroNotificationUrl,
        reference: user._id,
        senderName: user.nome + " " + user.sobrenome,
        //senderCPF: user.cpf,
        senderCPF: '00000000000',
        senderAreaCode: user.whatsapp.slice(0, 2),
        senderPhone: user.whatsapp.slice(2),
        senderEmail: 'c52285184118243909843@sandbox.pagseguro.com.br',
        senderHash: senderHash,
        shippingAddressRequired: 'false'
    }
    return boleto;
}

const newTransaction = async (transaction) => {
    var url;
    if (config.useSandbox) {
        url = `https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?email=${config.pagseguroEmail}&token=${config.pagseguroSandboxToken}`
    } else {
        url = `https://ws.pagseguro.uol.com.br/v2/transactions?email=${config.pagseguroEmail}&token=${config.pagSeguroToken}`
    }
    let requestBody = jsonToQuery(transaction);

    let response = await fetch(url, {
        body: requestBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })

    const resultString = await response.text();

    const result = await xml2js(resultString);

    return result.transaction;
}

const getNotification = async (transaction) => {
    var url;
    if (config.useSandbox) {
        url = `https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?email=${config.pagseguroEmail}&token=${config.pagseguroSandboxToken}`
    } else {
        url = `https://ws.pagseguro.uol.com.br/v2/transactions?email=${config.pagseguroEmail}&token=${config.pagSeguroToken}`
    }
    let requestBody = jsonToQuery(transaction);

    let response = await fetch(url, {
        body: requestBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })

    const resultString = await response.text();

    const result = await xml2js(resultString);

    return result.transaction;
}

jsonToQuery = (object) => {
    let encodedString = Object.keys(object).reduce(
        (queryString, key) => {
            return `${queryString}${key}=${encodeURIComponent(object[key])}&`;
        },
        ""
    ).slice(0, -1);

    return encodedString;
}

module.exports = {
    authenticate,
    newTransaction,
    newBoleto,
    getNotification
}