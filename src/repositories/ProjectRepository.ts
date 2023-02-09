import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";

export const ProjectRepository = AppDataSource.getRepository(Project)