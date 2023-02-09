import { Request, Response } from "express";
import * as yup from 'yup';
import { ProjectRepository } from "../repositories/ProjectRepository";
import { UserRepository } from "../repositories/UserRepository";

type TParams = {
    userId?: string,
}

type TBody = {
    company_distribution: string,
    total_potency: number,
    client_name: string,
    client_cellphone: string,
    file: string,
    
    cep: string,
    state: string  , 
    city: string ,
    neighborhood: string ,
    address: string,
    number: number,
    user_id: number,
}

type TProject =  {
    body: TBody | undefined,
    params: TParams | undefined
}

const ProjectSchema: yup.SchemaOf<TProject> = yup.object().shape({
    body : yup.object().shape({
        cep: yup.string().min(8, "Campo CEP deve ter pelo menos 8 caracteres!").required('Campo CEP é necessário!'),
		state: yup.string().required('Campo Estado é necessário!'), 
		city: yup.string().required('Campo Cidade é necessário!'),
		neighborhood: yup.string().required('Campo Bairro é necessário!'),
		address: yup.string().required('Campo Endereço é necessário!'),
		number: yup.number().typeError("Campo numero não pode ser string!"),

		company_distribution: yup.string().required('Campo Concessionária é necessário!'),
		total_potency: yup.number().typeError("Campo potencia total deve ser um número!").required('Campo Potência Total é necessário!'),
		client_cellphone: yup.string().min(11, 'Telefone Inválido').max(15, "Telefone Inválido!").required('Campo Telefone do cliente é necessário!'),
		client_name: yup.string().required('Campo Nome do cliente é necessário!'),
		file: yup.string().required('Arquivo necessário!'),
    }).optional(),

    params: yup.object().shape({
        userId: yup.string().required('Campo UserId string'),

    }).optional()

        
})

export class ProjectController {
    async create(req: Request, res: Response) {
        const reqProject: TBody  = req.body;
        const params: TParams = req.params;


        try {
             await ProjectSchema.validate({
                body: reqProject,
                params: params,
             })

            try {
                const existUser = await UserRepository.findOne({
                   where: {
                    id: Number(params.userId)
                   }
                })
               
                if(!existUser) {
                    return res.status(400).json({message: "Usuário não existe!"})
                }

                const newRepository = ProjectRepository.create({...reqProject, user_id: params.userId})
                await ProjectRepository.save(newRepository);
                
                return res.status(201).json({message: "Projeto criado com sucesso!"})

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
        let { projectId } = req.params;

        if(!updateData) {
            return  res.status(400).json({message: "Nenhum dado foi enviado"})
        }

        try {
            const findProject = await ProjectRepository.findOne({
                where: {
                    id: Number(projectId)
                }
            })

            if(!findProject) {
                return  res.status(404).json({message: "Projeto não foi Atualizado!"})
            }
            
            await ProjectRepository.update(Number(projectId), {...updateData})
            return res.status(201).json({message: "Atualização de projeto feita com sucesso!"})

        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }

    }

    async get(req: Request, res: Response) {
        let { projectId } = req.params;

        try {
            const project = await ProjectRepository.findOne({
                where: {
                    id: Number(projectId)
                }
            })
            
            if(!project)
                return res.status(404).json({message: "Projeto não encontrado!"});

            return res.status(201).json({project});
            
        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }

    }

    async delete(req: Request, res: Response) {
        let { projectId } = req.params;

        try {
            const project = await ProjectRepository.findOne({
                where: {
                    id: Number(projectId)
                }
            })
            
            if(!project)
                return res.status(404).json({message: "Projeto não encontrado!"});

            await ProjectRepository.delete(Number(projectId))
            return res.status(201).json({project});
            
        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }

    }

    async getAll(req: Request, res: Response) {
        try {
            const project = await ProjectRepository.find()
            
            if(!project)
                return res.status(404).json({message: "Nenhum Projeto Encontrado!"});

            return res.status(201).json(project);
            
        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }
    }

    async getPerState(req: Request, res: Response) {
        const { state } = req.params;

        try {
            const projects = await ProjectRepository.find({
                where: {
                    state: state,
                }
            })
            
            if(!projects)
                return res.status(404).json({message: "Nenhum Projeto Encontrado!"});

            return res.status(201).json(projects);
            
        }catch(err) {
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor!'
            })        
        }
    }

}