import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

type JwtPayload = {
    id: number,
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { authorization } = req.headers;

        if(!authorization) {
            return res.status(404).json({
                message: 'Token não informado!'
            })
        }

        const token = authorization.split(" ")[1]; 
        const { id } = jwt.verify(token, process.env.PRIVATE_KEY ?? '') as JwtPayload;
        
        const user = await UserRepository.find({
            where: {
                id: id,
            }
        })
        
        if(!user) {
            return res.status(403).json({
                message: 'Usuário não existe',
            })
        }

        next();
    } catch(err) {
        return res.status(403).json({
            message: 'Token Invalido!'
        })
    }

}