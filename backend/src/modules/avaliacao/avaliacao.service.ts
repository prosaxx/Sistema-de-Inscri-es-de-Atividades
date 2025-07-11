import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ClienteService } from '../cliente/cliente.service';
import { AtividadeService } from '../atividade/atividade.service';
import { CreateAvaliacaoDto, TipoAvaliacao } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { Avaliacao } from './entities/avaliacao.entity';

@Injectable()
export class AvaliacaoService {
  private readonly collection = 'avaliacoes';

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly clienteService: ClienteService,
    private readonly atividadeService: AtividadeService,
  ) {}

  async create(createAvaliacaoDto: CreateAvaliacaoDto): Promise<Avaliacao> {
    try {
      // Verificar se o cliente existe
      await this.clienteService.findOne(createAvaliacaoDto.clienteId);

      // Se foi informada uma atividade, verificar se ela existe
      if (createAvaliacaoDto.atividadeId) {
        await this.atividadeService.findOne(createAvaliacaoDto.atividadeId, false);
      }

      const avaliacaoData = {
        ...createAvaliacaoDto,
        dataCriacao: new Date(),
      };

      const id = await this.firebaseService.create(this.collection, avaliacaoData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar avaliação: ' + error.message);
    }
  }

  async findAll(includeRelations = false): Promise<Avaliacao[]> {
    try {
      const avaliacoes = await this.firebaseService.findAll(this.collection);
      
      const avaliacoesFormatadas = await Promise.all(
        avaliacoes.map(async (avaliacao) => {
          const avaliacaoFormatada: Avaliacao = {
            ...avaliacao,
            dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
            dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
            dataResposta: avaliacao.dataResposta?.toDate(),
          };

          if (includeRelations) {
            try {
              avaliacaoFormatada.cliente = await this.clienteService.findOne(avaliacao.clienteId);
              
              if (avaliacao.atividadeId) {
                avaliacaoFormatada.atividade = await this.atividadeService.findOne(avaliacao.atividadeId, false);
              }
            } catch {
              // Se não encontrar cliente ou atividade, continua sem eles
            }
          }

          return avaliacaoFormatada;
        })
      );

      return avaliacoesFormatadas;
    } catch (error) {
      throw new BadRequestException('Erro ao buscar avaliações: ' + error.message);
    }
  }

  async findOne(id: string, includeRelations = true): Promise<Avaliacao> {
    try {
      const avaliacao = await this.firebaseService.findById(this.collection, id);
      if (!avaliacao) {
        throw new NotFoundException(`Avaliação com ID ${id} não encontrada`);
      }

      const avaliacaoFormatada: Avaliacao = {
        ...avaliacao,
        dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
        dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
        dataResposta: avaliacao.dataResposta?.toDate(),
      };

      if (includeRelations) {
        try {
          avaliacaoFormatada.cliente = await this.clienteService.findOne(avaliacao.clienteId);
          
          if (avaliacao.atividadeId) {
            avaliacaoFormatada.atividade = await this.atividadeService.findOne(avaliacao.atividadeId, false);
          }
        } catch {
          // Se não encontrar cliente ou atividade, continua sem eles
        }
      }

      return avaliacaoFormatada;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar avaliação: ' + error.message);
    }
  }

  async update(id: string, updateAvaliacaoDto: UpdateAvaliacaoDto): Promise<Avaliacao> {
    try {
      // Verificar se a avaliação existe
      await this.findOne(id, false);

      // Se estiver atualizando cliente, verificar se ele existe
      if (updateAvaliacaoDto.clienteId) {
        await this.clienteService.findOne(updateAvaliacaoDto.clienteId);
      }

      // Se estiver atualizando atividade, verificar se ela existe
      if (updateAvaliacaoDto.atividadeId) {
        await this.atividadeService.findOne(updateAvaliacaoDto.atividadeId, false);
      }

      await this.firebaseService.update(this.collection, id, updateAvaliacaoDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar avaliação: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verificar se a avaliação existe
      await this.findOne(id, false);

      await this.firebaseService.delete(this.collection, id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir avaliação: ' + error.message);
    }
  }

  async findByCliente(clienteId: string): Promise<Avaliacao[]> {
    try {
      const avaliacoes = await this.firebaseService.findWhere(
        this.collection,
        'clienteId',
        '==',
        clienteId
      );

      return Promise.all(
        avaliacoes.map(async (avaliacao) => {
          try {
            const atividade = avaliacao.atividadeId 
              ? await this.atividadeService.findOne(avaliacao.atividadeId, false)
              : undefined;
            
            return {
              ...avaliacao,
              atividade,
              dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
              dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
              dataResposta: avaliacao.dataResposta?.toDate(),
            };
          } catch {
            return {
              ...avaliacao,
              dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
              dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
              dataResposta: avaliacao.dataResposta?.toDate(),
            };
          }
        })
      );
    } catch (error) {
      throw new BadRequestException('Erro ao buscar avaliações por cliente: ' + error.message);
    }
  }

  async findByAtividade(atividadeId: string): Promise<Avaliacao[]> {
    try {
      const avaliacoes = await this.firebaseService.findWhere(
        this.collection,
        'atividadeId',
        '==',
        atividadeId
      );

      return Promise.all(
        avaliacoes.map(async (avaliacao) => {
          try {
            const cliente = await this.clienteService.findOne(avaliacao.clienteId);
            return {
              ...avaliacao,
              cliente,
              dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
              dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
              dataResposta: avaliacao.dataResposta?.toDate(),
            };
          } catch {
            return {
              ...avaliacao,
              dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
              dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
              dataResposta: avaliacao.dataResposta?.toDate(),
            };
          }
        })
      );
    } catch (error) {
      throw new BadRequestException('Erro ao buscar avaliações por atividade: ' + error.message);
    }
  }

  async findByTipo(tipo: TipoAvaliacao): Promise<Avaliacao[]> {
    try {
      const avaliacoes = await this.firebaseService.findWhere(
        this.collection,
        'tipo',
        '==',
        tipo
      );

      return avaliacoes.map(avaliacao => ({
        ...avaliacao,
        dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
        dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
        dataResposta: avaliacao.dataResposta?.toDate(),
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar avaliações por tipo: ' + error.message);
    }
  }

  async findByUnidade(unidade: string): Promise<Avaliacao[]> {
    try {
      const avaliacoes = await this.firebaseService.findWhere(
        this.collection,
        'unidadeSesc',
        '==',
        unidade
      );

      return avaliacoes.map(avaliacao => ({
        ...avaliacao,
        dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
        dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
        dataResposta: avaliacao.dataResposta?.toDate(),
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar avaliações por unidade: ' + error.message);
    }
  }

  async responderAvaliacao(
    id: string, 
    resposta: string, 
    respondidoPor: string
  ): Promise<Avaliacao> {
    try {
      const updateData = {
        resposta,
        dataResposta: new Date(),
        respondidoPor,
      };

      await this.firebaseService.update(this.collection, id, updateData);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException('Erro ao responder avaliação: ' + error.message);
    }
  }

  async findSemResposta(): Promise<Avaliacao[]> {
    try {
      const todasAvaliacoes = await this.firebaseService.findAll(this.collection);
      
      const avaliacoesSemResposta = todasAvaliacoes.filter(
        avaliacao => !avaliacao.resposta
      );

      return avaliacoesSemResposta.map(avaliacao => ({
        ...avaliacao,
        dataCriacao: avaliacao.createdAt?.toDate() || new Date(),
        dataAtualizacao: avaliacao.updatedAt?.toDate() || new Date(),
        dataResposta: avaliacao.dataResposta?.toDate(),
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar avaliações sem resposta: ' + error.message);
    }
  }

  async getEstatisticas(): Promise<any> {
    try {
      const avaliacoes = await this.firebaseService.findAll(this.collection);
      
      const estatisticas = {
        total: avaliacoes.length,
        porTipo: {
          criticas: avaliacoes.filter(a => a.tipo === TipoAvaliacao.CRITICA).length,
          sugestoes: avaliacoes.filter(a => a.tipo === TipoAvaliacao.SUGESTAO).length,
          elogios: avaliacoes.filter(a => a.tipo === TipoAvaliacao.ELOGIO).length,
        },
        respondidas: avaliacoes.filter(a => a.resposta).length,
        pendentes: avaliacoes.filter(a => !a.resposta).length,
        notaMedia: avaliacoes
          .filter(a => a.nota)
          .reduce((acc, a, _, arr) => acc + a.nota / arr.length, 0) || 0,
      };

      return estatisticas;
    } catch (error) {
      throw new BadRequestException('Erro ao gerar estatísticas: ' + error.message);
    }
  }
}