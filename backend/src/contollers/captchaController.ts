var request = require('request');


export async function reCaptchaVerification(req, res) {
    /*if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.status(500).json({ "responseError": "something went wrong" });
    }
    const captchaKey = process.env.CAPTCHA_KEY
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + captchaKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL, function (error, response, body) {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
            return res.status(401).json({ "responseError": "Failed captcha verification" });
        }
        res.status(200).json({ "responseSuccess": "Sucess" });
    });*/
};