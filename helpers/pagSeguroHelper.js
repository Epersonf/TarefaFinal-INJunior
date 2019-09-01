var config = require('../config');
const fetch = require("node-fetch");
var xml2js = require('xml2js-es6-promise');

const authenticate = async () => {
    const url = `${config.pagSeguroUrl}/v2/sessions?email=${config.pagseguroEmail}&token=${config.pagseguroToken}`;
    console.log({ url });
    const response = await fetch(url, { method: 'POST' });
    const sessionString = await response.text();
    const session = await xml2js(sessionString);
    //console.info(`Authenticated:`, session)
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
        itemDescription1: payment.pecas[0] == 'enxoval' ? 'Enxoval' : 'Peças',
        itemAmount1: Number(payment.pago).toFixed(2),
        itemQuantity1: payment.pecas.length,
        notificationURL: config.pagseguroNotificationUrl,
        reference: user._id,
        senderName: user.nome + " " + user.sobrenome,
        senderCPF: user.cpf,
        senderAreaCode: user.whatsapp.slice(0, 2),
        senderPhone: user.whatsapp.slice(2),
        senderEmail: user.email,
        senderHash: senderHash,
        shippingAddressRequired: 'false'
    }

    if (config.appEnv === 'test') {
        boleto.senderEmail = 'c52285184118243909843@sandbox.pagseguro.com.br';
        boleto.senderCPF = '00000000000';
    }
    return boleto;
}

const collectionBoleto = (values, user, senderHash) => {
    let boleto = {
        paymentMode: 'default',
        paymentMethod: 'boleto',
        receiverEmail: config.pagseguroEmail,
        currency: 'BRL',
        extraAmount: '0.00',
        itemId1: '01',
        itemDescription1: 'Pecas',
        itemAmount1: values.products.toFixed(2),
        itemQuantity1: 1,
        notificationURL: config.pagseguroNotificationUrl,
        reference: user._id,
        senderName: user.nome + " " + user.sobrenome,
        senderCPF: user.cpf,
        senderAreaCode: user.whatsapp.slice(0, 2),
        senderPhone: user.whatsapp.slice(2),
        senderEmail: user.email,
        senderHash: senderHash,
        shippingAddressRequired: 'false'
    }

    if (config.appEnv === 'test') {
        boleto = {
            paymentMode: 'default',
            paymentMethod: 'boleto',
            receiverEmail: config.pagseguroEmail,
            notificationURL: config.pagseguroNotificationUrl,
            currency: 'BRL',
            extraAmount: '0.00',
            itemId1: '01',
            itemDescription1: 'Pecas',
            itemAmount1: values.products.toFixed(2),
            itemQuantity1: 1,
            senderName: 'User Tester',
            senderCPF: '00000000000',
            senderAreaCode: '31',
            senderPhone: '973607172',
            senderEmail: 'tester@sandbox.pagseguro.com.br',
            shippingAddressRequired: 'false',
        }
    }

    if (values.shipment > 0) {
        boleto = {
            ...boleto,
            itemId2: '02',
            itemDescription2: 'Frete',
            itemAmount2: values.shipment.toFixed(2),
            itemQuantity2: 1,
        }
    }

    return boleto;
}

const collectionCard = (values, user, senderHash) => {
    console.log(values);
    let card = {
        paymentMode: 'default',
        paymentMethod: 'creditCard',
        receiverEmail: config.pagseguroEmail,
        currency: 'BRL',
        extraAmount: '0.00',
        itemId1: '01',
        itemDescription1: 'Pecas',
        itemAmount1: values.products.toFixed(2),
        itemQuantity1: 1,
        notificationURL: config.pagseguroNotificationUrl,
        reference: user._id,
        senderName: user.nome + " " + user.sobrenome,
        senderCPF: user.cpf,
        senderAreaCode: user.whatsapp.slice(0, 2),
        senderPhone: user.whatsapp.slice(2),
        senderEmail: user.email,
        senderHash: senderHash,
        shippingAddressRequired: 'false',
        creditCardToken: values.cardToken,
        installmentQuantity: values.installments.quantity,
        installmentValue: values.installments.amount.toFixed(2),
        noInterestInstallmentQuantity: 2,
        creditCardHolderName: user.nome + " " + user.sobrenome,
        creditCardHolderCPF: user.cpf,
        creditCardHolderBirthDate: '31/07/1992',
        creditCardHolderAreaCode: user.whatsapp.slice(0, 2),
        creditCardHolderPhone: user.whatsapp.slice(2),
        billingAddressStreet: "Rua São Joaquim",
        billingAddressNumber: 257,
        billingAddressComplement: "casa",
        billingAddressDistrict: "Santo Antônio",
        billingAddressPostalCode: 36204632,
        billingAddressCity: "Barbacena",
        billingAddressState: "MG",
        billingAddressCountry: "BRA",
    }

    if (config.appEnv === 'test') {
        card = {
            paymentMode: 'default',
            paymentMethod: 'creditCard',
            receiverEmail: config.pagseguroEmail,
            notificationURL: config.pagseguroNotificationUrl,
            currency: 'BRL',
            extraAmount: '0.00',
            itemId1: '01',
            itemDescription1: 'Pecas',
            itemAmount1: values.products.toFixed(2),
            itemQuantity1: 1,
            senderName: 'User Tester',
            senderCPF: '00000000000',
            senderAreaCode: '31',
            senderPhone: '973607172',
            senderEmail: 'tester@sandbox.pagseguro.com.br',
            shippingAddressRequired: 'false',
            creditCardToken: values.cardToken,
            installmentQuantity: values.installments.quantity,
            installmentValue: values.installments.amount.toFixed(2),
            noInterestInstallmentQuantity: 2,
            creditCardHolderName: 'User Tester',
            creditCardHolderCPF: '00000000000',
            creditCardHolderBirthDate: '31/07/1992',
            creditCardHolderAreaCode: '31',
            creditCardHolderPhone: '973607172',
            billingAddressStreet: "Rua São Joaquim",
            billingAddressNumber: 257,
            billingAddressComplement: "casa",
            billingAddressDistrict: "Santo Antônio",
            billingAddressPostalCode: 36204632,
            billingAddressCity: "Barbacena",
            billingAddressState: "MG",
            billingAddressCountry: "BRA",
        }
    }

    if (values.shipment > 0) {
        card = {
            ...card,
            itemId2: '02',
            itemDescription2: 'Frete',
            itemAmount2: values.shipment.toFixed(2),
            itemQuantity2: 1,
        }
    }

    return card;
}

const newTransaction = async (transaction) => {
    const url = `${config.pagSeguroUrl}/v2/transactions?email=${config.pagseguroEmail}&token=${config.pagseguroToken}`;
    console.log({ url });
    const requestBody = jsonToQuery(transaction);
    console.log({ requestBody });
    try {
        let response = await fetch(url, {
            body: requestBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })
        const resultString = await response.text();
        console.log({ resultString });
        const result = await xml2js(resultString);
        //TODO -> Tratar o erro aqui 
        return result.transaction;
    }
    catch (error) {
        console.log('error_transacrion', error)
        throw (error);
    }

}

const getNotification = async (notificationCode) => {
    const url = `${config.pagSeguroUrl}/v3/transactions/notifications/${notificationCode}?email=${config.pagseguroEmail}&token=${config.pagseguroToken}`;

    let response = await fetch(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "GET"
    })

    const resultString = await response.text();

    const result = await xml2js(resultString);

    return result.transaction;
}


const jsonToQuery = (object) => {
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
    collectionBoleto,
    getNotification,
    collectionCard,
}