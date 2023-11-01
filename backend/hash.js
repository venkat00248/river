//consumerData.merchantId | consumerData.txnId | totalamount | consumerData.accountNo | consumerData.consumerId | consumerData.consumerMobileNo | consumerData.consumerEmailId | consumerData.debitStartDate | consumerData.debitEndDate | consumerData.maxAmount | consumerData.amountType | consumerData.frequency | consumerData.cardNumber | consumerData.expMonth | consumerData.expYear | consumerData.cvvCode | SALT
const sha512 = require('js-sha512');
var salt = "7039134982BXQEPG"
var txnObj = {
    merchantId: 'L3583',
    schemeCode: 'CTRLS',
    deviceId: 'WEBSH2',
    currency: 'INR',
};
var tokenObject = {
    txnId: new Date().getTime(),
    totalamount: "1",
    accountNo:"",
    consumerId: "9100576918" || '',
    consumerMobileNo: "9100576918" || '',
    consumerEmailId: "shanmukha.gadigi@gmail.com" || ''	,
    debitStartDate: "",
    debitEndDate: "",
    maxAmount: "",
    amountType: "",
    frequency: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvvCode: ""
};
/*var tokenObject = {
    txnId: new Date().getTime(),
    totalamount: req.totalamount,
    accountNo: req.accountNo || '',
    consumerId: req.consumerId || '',
    consumerMobileNo: req.consumerMobileNo || '',
    consumerEmailId: req.consumerEmailId || '',
    debitStartDate: req.debitStartDate || '',
    debitEndDate: req.debitEndDate || '',
    maxAmount: req.maxAmount || '',
    amountType: req.amountType || '',
    frequency: req.frequency || '',
    cardNumber: "5260990216474086",
    expMonth: "02",
    expYear: "26",
    cvvCode: "856"	
};*/

console.log('txn obj==================',txnObj)
var hashInput = txnObj.merchantId + '|';

for(var key in tokenObject){
    hashInput += tokenObject[key] + '|';
}

hashInput += salt;

console.log('\n--HASH input string:');
console.log(hashInput);

var token = sha512(hashInput); 
console.log('token object===========',tokenObject)
console.log('token================',token)