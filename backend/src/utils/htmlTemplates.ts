export function setSuccessTemplate(orderId,txnId,amount) {
    return `<html><head><title>Confirmation Page</title></head><body><center><h1>Payment Success</h1></center><table border="1"><tbody><div>orderId:${orderId}</div><div>transactionId:${txnId}</div><div>amount:${amount}</div></tbody></table></body></html>`
}

export function setFailureTemplate(orderId,errorMsg) {
    return `<html><head><title>Confirmation Page</title></head><body><center><h1>Payment Failure</h1></center><table border="1"><tbody><div>orderId:${orderId}</div><div>error:${errorMsg}</div></table></body></html>`
}