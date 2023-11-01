import { apiConstants } from "../Constants/apiConstants";
import * as crypto from "crypto";

//fetches current time in EPOCH and trims last 3 digits as in legacy DB only 11 digits are allowed to store in date field
export function fetchCurrentTime() {
    let date: any = Date.now()
    date = date.toString();
    date = date.slice(0, date.length - 3);
    //console.log('date', Number(date))
    return Number(date)
}

export const encryptPassword = ((val) => {
    let cipher = crypto.createCipheriv(apiConstants.ENC_ALGORITHM, apiConstants.ENC_KEY, apiConstants.IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  });
  
export const decryptPassword = ((encrypted) => {
    let decipher = crypto.createDecipheriv(apiConstants.ENC_ALGORITHM, apiConstants.ENC_KEY, apiConstants.IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  });