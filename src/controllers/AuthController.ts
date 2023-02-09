import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import { UserRepository } from "../repositories/UserRepository";

interface ILogin {
    email: string,
    password: string,
}

const UserSchema: yup.SchemaOf<ILogin> = yup.object().shape({
		email: yup.string().email("O campo deve ter um email válido!").required('Campo Email é necessário!'),
		password: yup.string().required("O campo senha é necessário!")  
})

export class AuthController {
    async login(req: Request, res: Response) {
        const {email, password }  = req.body;

        try {
             await UserSchema.validate({
                    email, 
                    password
             })

            try {
                const user = await UserRepository.findOne({
                    select: {
                        id: true,
                        name: true,
                        password: true
                    },
                    where: {
                        email: email
                    }
                })

                if(!user) {
                    return res.status(400).json({message: "Email ou senha incorretos!"})
                }

                const checkPassword = await bcrypt.compare(password, user.password)
                if(!checkPassword) {
                    return res.status(400).json({message: "Email ou senha incorretos!"})
                }

                const {password: _, ...userRest} = user;
                const token = jwt.sign({...userRest}, process.env.PRIVATE_KEY ?? "", {expiresIn: '1h'})
                
                return res.status(200).json({user: userRest, token: token})

            }catch(err) {
                return res.status(500).json({
                    message: 'Ocorreu um erro no servidor!'
                })        
            }

        }catch(err) {
           let yupErrors = err as yup.ValidationError;
           
           return res.status(400).json({
            errors: {
                default: yupErrors.message
            }
           })
        }

    }

    async checkTokenValidation(req: Request, res: Response) {
        const { authorization } = req.headers;
       
        const token = authorization?.split(' ')[1]

        if(!token){
            return res.status(401).json({
                message: 'Não autorizado'
            })  
        }
        var {id}: any= jwt.verify(token, process.env.PRIVATE_KEY ?? "");

        try {
            const user = await UserRepository.findOne({
                select: {
                    id: true,
                    name: true,
                },
                where: {
                    id: id
                }
            })

            if(!user) {
                return res.status(401).json({
                message: 'Não autorizado'
                })  
            }

            res.status(200).json({user: user})
                
        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })  
        }
        
    }

}