import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/auth/usuario/entities/usuario.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";

@Injectable()
export class PostagemService {
    constructor (
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>
    ){}

async findAll (): Promise<Postagem[]> {
    return await this.postagemRepository.find({
        relations: {
            tema: true,
            usuario: true
        }
    }); 
}

async findById (id: number): Promise<Postagem> {
    let postagem = await this.postagemRepository.findOne({
        where: {
            id
        },
        relations: {
            tema: true,
            usuario: true
        }

    });

    if(!postagem)
        throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);

        return postagem;
}

async findByTitulo (titulo: string): Promise<Postagem[]> {
    return await this.postagemRepository.find({
            where: {
                titulo: ILike(`%${titulo}%`)
            },
            relations: {
                tema: true,
                usuario: true
            }
        });
    }
    async create (postagem: Postagem): Promise<Postagem> {
        return await this.postagemRepository.save(postagem);
    }
    async update (postagem: Postagem): Promise<Postagem> {
        let buscaPostagem: Postagem = await this.findById(postagem.id);

        if(!buscaPostagem || !postagem.id)
            throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);

        return await this.postagemRepository.save(postagem);
    }
    async delete (id: number): Promise<DeleteResult>{
        let buscaPostagem = await this.findById(id);

        if (!buscaPostagem)
        throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

        return await this.postagemRepository.delete(id);
    }
}
