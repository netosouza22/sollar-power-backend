import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import * as yup from 'yup';
import { UserRepository } from "../repositories/UserRepository";

type TBody = {
    cep: string,
    state: string  , 
    city: string ,
    neighborhood: string ,
    address: string,
    number: number,
    name: string,
    email: string,
    password: string,
    cellphone: string,
    cpf: string,
}

type JwtPayload = {
    id: number,
}

type TUser =  {
    body: TBody | undefined,
}

const UserSchema: yup.SchemaOf<TUser> = yup.object().shape({
    body : yup.object().shape({
        cep: yup.string().min(8, "Campo CEP deve ter pelo menos 8 caracteres!").required('Campo CEP é necessário!'),
		state: yup.string().required('Campo Estado é necessário!'), 
		city: yup.string().required('Campo Cidade é necessário!'),
		neighborhood: yup.string().required('Campo Bairro é necessário!'),
		address: yup.string().required('Campo Endereço é necessário!'),
		number: yup.number(),

		name: yup.string().required('Campo Nome é necessário!'),
		email: yup.string().email("O campo deve ter um email válido!").required('Campo Email é necessário!'),
        password: yup.string().required('O campo senha é necessário!'),
		cpf: yup.string().min(11, 'cpf inválido').max(14, "Tamanho do CPF inválido").required('Campo CPF é necessário!'),
        cellphone: yup.string().required("Campo Telefone é necessário")
    }).optional()
        
})

export class UserController {
    async create(req: Request, res: Response) {
        const reqUser: TBody  = req.body;

        if(!reqUser){
            return res.status(400).json({
                message: 'Obrigatório ter dados',
            })
        }

        try {
             await UserSchema.validate({
                body: reqUser
             })

            try {
                const existUserCPF = await UserRepository.findOne({
                    where: {
                        cpf: reqUser.cpf
                    }
                })
                const existUserEmail = await UserRepository.findOne({
                    where: {
                        email: reqUser.email
                    }
                })

                if(existUserCPF || existUserEmail) {
                    return res.status(400).json({message: "email ou CPF já cadastrado!"})
                }

                const hashPasword = await bcrypt.hash(reqUser.password, 10);

                const newUser = UserRepository.create({...reqUser, password: hashPasword})
                await UserRepository.save(newUser);
                
                return res.status(201).json({message: "Usuário criado com sucesso!"})

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

    async update(req: Request, res: Response) {
        let updateData = req.body;
        let { userId } = req.params;

        try {
            const findUser = await UserRepository.findOne({
                where: {
                    id: Number(userId)
                }
            })
            
            if(!findUser) {
                return  res.status(404).json({message: "Usuário não encontrado!"})
            }
            
            await UserRepository.save({...updateData})
            return res.status(201).json({message: "Atualização de usuário feita com sucesso!"})

        }catch(err) {

            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }

    }

    async get(req: Request, res: Response) {
        const { userId } = req.params;

        try {
            const user = await UserRepository.findOne({
                relations: {
                    projects: true
                },
                where: {
                    id: Number(userId)
                }
            })
            
            if(!user)
                return res.status(404).json({message: "Usuário não encontrado!"});
    
            return res.status(201).json({user});
            
        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }
    }

    async delete(req: Request, res: Response) {
        let { userId } = req.params;

        try {
            const user = await UserRepository.findOne( {
                where: {
                    id: Number(userId)
                }
            });

            if(!user)
                return res.status(404).json({message: "Nenhum usuário encontrado!"});

            const a = await UserRepository.softDelete(user.id)

            return res.status(201).json(user);
            
        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const user = await UserRepository.find()
            
            if(!user)
                return res.status(404).json({message: "Nenhum Usuário Encontrado!"});

            return res.status(201).json(user);
            
        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }
    }

}