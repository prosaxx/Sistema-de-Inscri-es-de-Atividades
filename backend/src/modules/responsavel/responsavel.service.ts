import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { Responsavel } from './entities/responsavel.entity';

@Injectable()
export class ResponsavelService {
  private readonly collection = 'responsaveis';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createResponsavelDto: CreateResponsavelDto): Promise<Responsavel> {
    try {
      // Verificar se já existe responsável com a mesma matrícula
      const existingResponsaveis = await this.firebaseService.findWhere(
        this.collection,
        'matricula',
        '==',
        createResponsavelDto.matricula
      );

      if (existingResponsaveis.length > 0) {
        throw new BadRequestException('Já existe um responsável com esta matrícula');
      }

      const responsavelData = {
        ...createResponsavelDto,
        dataCriacao: new Date(),
      };

      const id = await this.firebaseService.create(this.collection, responsavelData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar responsável: ' + error.message);
    }
  }

  async findAll(): Promise<Responsavel[]> {
    try {
      const responsaveis = await this.firebaseService.findAll(this.collection);
      return responsaveis.map(responsavel => ({
        ...responsavel,
        dataCriacao: responsavel.createdAt?.toDate() || new Date(),
        dataAtualizacao: responsavel.updatedAt?.toDate() || new Date(),
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar responsáveis: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Responsavel> {
    try {
      const responsavel = await this.firebaseService.findById(this.collection, id);
      if (!responsavel) {
        throw new NotFoundException(`Responsável com ID ${id} não encontrado`);
      }

      return {
        ...responsavel,
        dataCriacao: responsavel.createdAt?.toDate() || new Date(),
        dataAtualizacao: responsavel.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar responsável: ' + error.message);
    }
  }

  async update(id: string, updateResponsavelDto: UpdateResponsavelDto): Promise<Responsavel> {
    try {
      // Verificar se o responsável existe
      await this.findOne(id);

      // Se estiver atualizando a matrícula, verificar se não existe outra igual
      if (updateResponsavelDto.matricula) {
        const existingResponsaveis = await this.firebaseService.findWhere(
          this.collection,
          'matricula',
          '==',
          updateResponsavelDto.matricula
        );

        const duplicateResponsavel = existingResponsaveis.find(
          responsavel => responsavel.id !== id
        );

        if (duplicateResponsavel) {
          throw new BadRequestException('Já existe um responsável com esta matrícula');
        }
      }

      await this.firebaseService.update(this.collection, id, updateResponsavelDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar responsável: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verificar se o responsável existe
      await this.findOne(id);

      // Verificar se o responsável possui atividades vinculadas
      const atividades = await this.firebaseService.findWhere('atividades', 'responsavelId', '==', id);
      if (atividades.length > 0) {
        throw new BadRequestException('Não é possível excluir responsável com atividades vinculadas');
      }

      await this.firebaseService.delete(this.collection, id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir responsável: ' + error.message);
    }
  }

  async findByMatricula(matricula: string): Promise<Responsavel | null> {
    try {
      const responsaveis = await this.firebaseService.findWhere(
        this.collection,
        'matricula',
        '==',
        matricula
      );

      if (responsaveis.length === 0) {
        return null;
      }

      const responsavel = responsaveis[0];
      return {
        ...responsavel,
        dataCriacao: responsavel.createdAt?.toDate() || new Date(),
        dataAtualizacao: responsavel.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar responsável por matrícula: ' + error.message);
    }
  }

  async findByName(nome: string): Promise<Responsavel[]> {
    try {
      const responsaveis = await this.firebaseService.findWhere(
        this.collection,
        'nomeResponsavel',
        '>=',
        nome
      );

      return responsaveis
        .filter(responsavel => 
          responsavel.nomeResponsavel.toLowerCase().includes(nome.toLowerCase())
        )
        .map(responsavel => ({
          ...responsavel,
          dataCriacao: responsavel.createdAt?.toDate() || new Date(),
          dataAtualizacao: responsavel.updatedAt?.toDate() || new Date(),
        }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar responsáveis por nome: ' + error.message);
    }
  }
}