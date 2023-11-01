import { Request, Response,NextFunction } from "express";
export function parseRequestBody(req:Request,res:Response,next:NextFunction) {
    try{
        let details: any = JSON.parse(atob(req.body.data));
       req['data'] = details
       next()
    } catch(error){
        res.status(500).json({
            error: error.message
        })
    }
}