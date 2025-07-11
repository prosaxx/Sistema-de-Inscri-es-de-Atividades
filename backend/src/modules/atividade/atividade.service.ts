import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ResponsavelService } from '../responsavel/responsavel.service';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { Atividade } from './entities/atividade.entity';

@Injectable()
export class AtividadeService {
  private readonly collection = 'atividades';

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly responsavelService: ResponsavelService,
  ) {}

  async create(createAtividadeDto: CreateAtividadeDto): Promise<Atividade> {
    try {
      // Verificar se o responsável existe
      await this.responsavelService.findOne(createAtividadeDto.responsavelId);

      // Verificar se já existe atividade com o mesmo nome na mesma unidade
      const existingAtividades = await this.firebaseService.findWhere(
        this.collection,
        'nomeAtividade',
        '==',
        createAtividadeDto.nomeAtividade
      );

      const duplicateAtividade = existingAtividades.find(
        atividade => atividade.unidadeSesc === createAtividadeDto.unidadeSesc
      );

      if (duplicateAtividade) {
        throw new BadRequestException('Já existe uma atividade com este nome nesta unidade SESC');
      }

      const atividadeData = {
        ...createAtividadeDto,
        dataCriacao: new Date(),
      };

      const id = await this.firebaseService.create(this.collection, atividadeData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar atividade: ' + error.message);
    }
  }

  async findAll(includeResponsavel = false): Promise<Atividade[]> {
    try {
      const atividades = await this.firebaseService.findAll(this.collection);
      
      const atividadesFormatadas = await Promise.all(
        atividades.map(async (atividade) => {
          const atividadeFormatada: Atividade = {
            ...atividade,
            dataCriacao: atividade.createdAt?.toDate() || new Date(),
            dataAtualizacao: atividade.updatedAt?.toDate() || new Date(),
          };

          if (includeResponsavel) {
            try {
              atividadeFormatada.responsavel = await this.responsavelService.findOne(atividade.responsavelId);
            } catch {
              // Se não encontrar o responsável, continua sem ele
            }
          }

          // Contar inscrições
          const inscricoes = await this.firebaseService.findWhere('inscricoes', 'atividadeId', '==', atividade.id);
          atividadeFormatada.totalInscricoes = inscricoes.length;

          return atividadeFormatada;
        })
      );

      return atividadesFormatadas;
    } catch (error) {
      throw new BadRequestException('Erro ao buscar atividades: ' + error.message);
    }
  }

  async findOne(id: string, includeResponsavel = true): Promise<Atividade> {
    try {
      const atividade = await this.firebaseService.findById(this.collection, id);
      if (!atividade) {
        throw new NotFoundException(`Atividade com ID ${id} não encontrada`);
      }

      const atividadeFormatada: Atividade = {
        ...atividade,
        dataCriacao: atividade.createdAt?.toDate() || new Date(),
        dataAtualizacao: atividade.updatedAt?.toDate() || new Date(),
      };

      if (includeResponsavel) {
        try {
          atividadeFormatada.responsavel = await this.responsavelService.findOne(atividade.responsavelId);
        } catch {
          // Se não encontrar o responsável, continua sem ele
        }
      }

      // Contar inscrições
      const inscricoes = await this.firebaseService.findWhere('inscricoes', 'atividadeId', '==', id);
      atividadeFormatada.totalInscricoes = inscricoes.length;

      return atividadeFormatada;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar atividade: ' + error.message);
    }
  }

  async update(id: string, updateAtividadeDto: UpdateAtividadeDto): Promise<Atividade> {
    try {
      // Verificar se a atividade existe
      await this.findOne(id, false);

      // Se estiver atualizando o responsável, verificar se ele existe
      if (updateAtividadeDto.responsavelId) {
        await this.responsavelService.findOne(updateAtividadeDto.responsavelId);
      }

      // Se estiver atualizando nome ou unidade, verificar duplicatas
      if (updateAtividadeDto.nomeAtividade || updateAtividadeDto.unidadeSesc) {
        const atividadeAtual = await this.firebaseService.findById(this.collection, id);
        const existingAtividades = await this.firebaseService.findWhere(
          this.collection,
          'nomeAtividade',
          '==',
          updateAtividadeDto.nomeAtividade || atividadeAtual.nomeAtividade
        );

        const duplicateAtividade = existingAtividades.find(
          atividade => 
            atividade.id !== id &&
            atividade.unidadeSesc === (updateAtividadeDto.unidadeSesc || atividadeAtual.unidadeSesc)
        );

        if (duplicateAtividade) {
          throw new BadRequestException('Já existe uma atividade com este nome nesta unidade SESC');
        }
      }

      await this.firebaseService.update(this.collection, id, updateAtividadeDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar atividade: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verificar se a atividade existe
      await this.findOne(id, false);

      // Verificar se a atividade possui inscrições
      const inscricoes = await this.firebaseService.findWhere('inscricoes', 'atividadeId', '==', id);
      if (inscricoes.length > 0) {
        throw new BadRequestException('Não é possível excluir atividade com inscrições ativas');
      }

      await this.firebaseService.delete(this.collection, id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir atividade: ' + error.message);
    }
  }

  async findByUnidade(unidade: string): Promise<Atividade[]> {
    try {
      const atividades = await this.firebaseService.findWhere(
        this.collection,
        'unidadeSesc',
        '==',
        unidade
      );

      return Promise.all(
        atividades.map(async (atividade) => {
          const inscricoes = await this.firebaseService.findWhere('inscricoes', 'atividadeId', '==', atividade.id);
          return {
            ...atividade,
            dataCriacao: atividade.createdAt?.toDate() || new Date(),
            dataAtualizacao: atividade.updatedAt?.toDate() || new Date(),
            totalInscricoes: inscricoes.length,
          };
        })
      );
    } catch (error) {
      throw new BadRequestException('Erro ao buscar atividades por unidade: ' + error.message);
    }
  }

  async findByResponsavel(responsavelId: string): Promise<Atividade[]> {
    try {
      const atividades = await this.firebaseService.findWhere(
        this.collection,
        'responsavelId',
        '==',
        responsavelId
      );

      return Promise.all(
        atividades.map(async (atividade) => {
          const inscricoes = await this.firebaseService.findWhere('inscricoes', 'atividadeId', '==', atividade.id);
          return {
            ...atividade,
            dataCriacao: atividade.createdAt?.toDate() || new Date(),
            dataAtualizacao: atividade.updatedAt?.toDate() || new Date(),
            totalInscricoes: inscricoes.length,
          };
        })
      );
    } catch (error) {
      throw new BadRequestException('Erro ao buscar atividades por responsável: ' + error.message);
    }
  }

  async findByName(nome: string): Promise<Atividade[]> {
    try {
      const atividades = await this.firebaseService.findWhere(
        this.collection,
        'nomeAtividade',
        '>=',
        nome
      );

      const atividadesFiltradas = atividades.filter(atividade => 
        atividade.nomeAtividade.toLowerCase().includes(nome.toLowerCase())
      );

      return Promise.all(
        atividadesFiltradas.map(async (atividade) => {
          const inscricoes = await this.firebaseService.findWhere('inscricoes', 'atividadeId', '==', atividade.id);
          return {
            ...atividade,
            dataCriacao: atividade.createdAt?.toDate() || new Date(),
            dataAtualizacao: atividade.updatedAt?.toDate() || new Date(),
            totalInscricoes: inscricoes.length,
          };
        })
      );
    } catch (error) {
      throw new BadRequestException('Erro ao buscar atividades por nome: ' + error.message);
    }
  }
}