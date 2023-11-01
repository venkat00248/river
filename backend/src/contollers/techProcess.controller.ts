import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config()

/*export function techProcessCallBack(req: Request, res: Response) {
    try{
    const sha512 = require('js-sha512');
    console.log('req body===========',req.body)
    
    //Techprocess failed response
    reqObj.body = {"msg":"0399|failure|TPPGE161|4PY0000140269|820|0|1.00|{email:rajesh.ponyaboina@cloud4c.com}{mob:8465051656}||NA|||||e463606e-26d7-4b04-ad84-2460ef284bea|9ec35f567a37fa945aa5f1e19475735fff9af9189bfc5163a877c9f2632a4f16c9a46adef0babe98c6b5cd69489b1fcef17237f8f60970d7240c9c763c0abc22"};
	
    //Techprocess success response
    reqObj.body = {msg: '0300|success|NA|4PYUAT0000140276|1270|1616768219|1.00|{email:rajesh.ponyaboina@cloud4c.com}{mob:8465051656}|08-11-2021 16:34:29|NA|||||47edd3cf-e9b1-41ec-afed-6dd8b22badfd|8ac97487ded5c7d536f506232da0ea683f4ddfff0832a7521aca9cb17120c6b0032e48cfc5c06744c692d9da17010d369b3f990bf6b6717926701027b7f2f142'};
     
    if (typeof req.body != 'undefined' && typeof req.body.msg != 'undefined' && req.body.msg != '' && req.body.msg.indexOf("|") !== -1) {
        let response = req.body;
        let msg = ''

        let msgResponse = req.body.msg;
        let resArr = msgResponse.split('|');
        var resHash = resArr[resArr.length - 1];
        console.log('\n--response array:');
        console.log(resArr);

        resArr[resArr.length - 1] = process.env.CCKEY;
        let newInput = '';
        for (let i=0;i<resArr.length;i++) {
            if (i != 0) {
                newInput += '|' + resArr[i];
            } else {
                newInput += resArr[i];
            }
        }
        console.log('\n--response string after replacing HASH with SALT:');
        console.log(newInput);
        var newResHash = sha512(newInput);
        console.log('Received HASH: ' + resHash);
        console.log('New HASH: ' + newResHash);
        if (resHash == newResHash) {
            let txn_status = '';
            console.log('-----HASH mach-----');
            if (resArr[0] == '0300') {
                txn_status = 'success';
                console.log('TXN Success.');
                msg= "transaction success"
            } else if (resArr[0] == '0398') {
                txn_status = 'error';
                console.log('TXN Initiated.');
                msg = 'TXN Initiated'
            } else {
                txn_status = 'error';
                console.log('TXN Failed.');
                console.log(resArr[2]);
                throw new Error('transaction failed')
            }
            console.log('txn_status')
        }
        res.send({
            message:msg
        })
    } else{
        throw new Error('Internal server error')
    }
}catch(error){
    res.send({
        error: error.message
    })
}

}*/