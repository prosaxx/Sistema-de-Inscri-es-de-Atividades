import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ClienteService } from '../cliente/cliente.service';
import { AtividadeService } from '../atividade/atividade.service';
import { CreateInscricaoDto, StatusInscricao } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { Inscricao } from './entities/inscricao.entity';

@Injectable()
export class InscricaoService {
  private readonly collection = 'inscricoes';

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly clienteService: ClienteService,
    private readonly atividadeService: AtividadeService,
  ) {}

  async create(createInscricaoDto: CreateInscricaoDto): Promise<Inscricao> {
    try {
      // Verificar se o cliente existe
      await this.clienteService.findOne(createInscricaoDto.clienteId);

      // Verificar se a atividade existe
      await this.atividadeService.findOne(createInscricaoDto.atividadeId, false);

      // Verificar se o cliente já está inscrito nesta atividade
      const existingInscricoes = await this.firebaseService.findWhere(
        this.collection,
        'clienteId',
        '==',
        createInscricaoDto.clienteId
      );

      const duplicateInscricao = existingInscricoes.find(
        inscricao => 
          inscricao.atividadeId === createInscricaoDto.atividadeId &&
          (inscricao.status === StatusInscricao.ATIVA || inscricao.status === StatusInscricao.PENDENTE)
      );

      if (duplicateInscricao) {
        throw new BadRequestException('Cliente já possui inscrição ativa ou pendente nesta atividade');
      }

      // Validar datas
      const dataInicio = new Date(createInscricaoDto.dataInicio);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (dataInicio < hoje) {
        throw new BadRequestException('Data de início não pode ser anterior à data atual');
      }

      if (createInscricaoDto.dataFim) {
        const dataFim = new Date(createInscricaoDto.dataFim);
        if (dataFim <= dataInicio) {
          throw new BadRequestException('Data de fim deve ser posterior à data de início');
        }
      }

      const inscricaoData = {
        ...createInscricaoDto,
        status: createInscricaoDto.status || StatusInscricao.ATIVA,
        dataInscricao: new Date(),
      };

      const id = await this.firebaseService.create(this.collection, inscricaoData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar inscrição: ' + error.message);
    }
  }

  async findAll(includeRelations = false): Promise<Inscricao[]> {
    try {
      const inscricoes = await this.firebaseService.findAll(this.collection);
      
      const inscricoesFormatadas = await Promise.all(
        inscricoes.map(async (inscricao) => {
          const inscricaoFormatada: Inscricao = {
            ...inscricao,
            dataInscricao: inscricao.createdAt?.toDate() || new Date(),
            dataAtualizacao: inscricao.updatedAt?.toDate() || new Date(),
          };

          if (includeRelations) {
            try {
              inscricaoFormatada.cliente = await this.clienteService.findOne(inscricao.clienteId);
              inscricaoFormatada.atividade = await this.atividadeService.findOne(inscricao.atividadeId, false);
            } catch {
              // Se não encontrar cliente ou atividade, continua sem eles
            }
          }

          return inscricaoFormatada;
        })
      );

      return inscricoesFormatadas;
    } catch (error) {
      throw new BadRequestException('Erro ao buscar inscrições: ' + error.message);
    }
  }

  async findOne(id: string, includeRelations = true): Promise<Inscricao> {
    try {
      const inscricao = await this.firebaseService.findById(this.collection, id);
      if (!inscricao) {
        throw new NotFoundException(`Inscrição com ID ${id} não encontrada`);
      }

      const inscricaoFormatada: Inscricao = {
        ...inscricao,
        dataInscricao: inscricao.createdAt?.toDate() || new Date(),
        dataAtualizacao: inscricao.updatedAt?.toDate() || new Date(),
      };

      if (includeRelations) {
        try {
          inscricaoFormatada.cliente = await this.clienteService.findOne(inscricao.clienteId);
          inscricaoFormatada.atividade = await this.atividadeService.findOne(inscricao.atividadeId, false);
        } catch {
          // Se não encontrar cliente ou atividade, continua sem eles
        }
      }

      return inscricaoFormatada;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar inscrição: ' + error.message);
    }
  }

  async update(id: string, updateInscricaoDto: UpdateInscricaoDto): Promise<Inscricao> {
    try {
      // Verificar se a inscrição existe
      const inscricaoAtual = await this.findOne(id, false);

      // Se estiver atualizando cliente, verificar se ele existe
      if (updateInscricaoDto.clienteId) {
        await this.clienteService.findOne(updateInscricaoDto.clienteId);
      }

      // Se estiver atualizando atividade, verificar se ela existe
      if (updateInscricaoDto.atividadeId) {
        await this.atividadeService.findOne(updateInscricaoDto.atividadeId, false);
      }

      // Validar datas se estiverem sendo atualizadas
      if (updateInscricaoDto.dataInicio || updateInscricaoDto.dataFim) {
        const dataInicio = new Date(updateInscricaoDto.dataInicio || inscricaoAtual.dataInicio);
        
        if (updateInscricaoDto.dataFim) {
          const dataFim = new Date(updateInscricaoDto.dataFim);
          if (dataFim <= dataInicio) {
            throw new BadRequestException('Data de fim deve ser posterior à data de início');
          }
        }
      }

      // Verificar duplicata se estiver mudando cliente ou atividade
      if (updateInscricaoDto.clienteId || updateInscricaoDto.atividadeId) {
        const clienteId = updateInscricaoDto.clienteId || inscricaoAtual.clienteId;
        const atividadeId = updateInscricaoDto.atividadeId || inscricaoAtual.atividadeId;
        const status = updateInscricaoDto.status || inscricaoAtual.status;

        if (status === StatusInscricao.ATIVA || status === StatusInscricao.PENDENTE) {
          const existingInscricoes = await this.firebaseService.findWhere(
            this.collection,
            'clienteId',
            '==',
            clienteId
          );

          const duplicateInscricao = existingInscricoes.find(
            inscricao => 
              inscricao.id !== id &&
              inscricao.atividadeId === atividadeId &&
              (inscricao.status === StatusInscricao.ATIVA || inscricao.status === StatusInscricao.PENDENTE)
          );

          if (duplicateInscricao) {
            throw new BadRequestException('Cliente já possui inscrição ativa ou pendente nesta atividade');
          }
        }
      }

      await this.firebaseService.update(this.collection, id, updateInscricaoDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar inscrição: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verificar se a inscrição existe
      await this.findOne(id, false);

      await this.firebaseService.delete(this.collection, id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir inscrição: ' + error.message);
    }
  }

  async findByCliente(clienteId: string): Promise<Inscricao[]> {
    try {
      const inscricoes = await this.firebaseService.findWhere(
        this.collection,
        'clienteId',
        '==',
        clienteId
      );

      return Promise.all(
        inscricoes.map(async (inscricao) => {
          try {
            const atividade = await this.atividadeService.findOne(inscricao.atividadeId, false);
            return {
              ...inscricao,
              atividade,
              dataInscricao: inscricao.createdAt?.toDate() || new Date(),
              dataAtualizacao: inscricao.updatedAt?.toDate() || new Date(),
            };
          } catch {
            return {
              ...inscricao,
              dataInscricao: inscricao.createdAt?.toDate() || new Date(),
              dataAtualizacao: inscricao.updatedAt?.toDate() || new Date(),
            };
          }
        })
      );
    } catch (error) {
      throw new BadRequestException('Erro ao buscar inscrições por cliente: ' + error.message);
    }
  }

  async findByAtividade(atividadeId: string): Promise<Inscricao[]> {
    try {
      const inscricoes = await this.firebaseService.findWhere(
        this.collection,
        'atividadeId',
        '==',
        atividadeId
      );

      return Promise.all(
        inscricoes.map(async (inscricao) => {
          try {
            const cliente = await this.clienteService.findOne(inscricao.clienteId);
            return {
              ...inscricao,
              cliente,
              dataInscricao: inscricao.createdAt?.toDate() || new Date(),
              dataAtualizacao: inscricao.updatedAt?.toDate() || new Date(),
            };
          } catch {
            return {
              ...inscricao,
              dataInscricao: inscricao.createdAt?.toDate() || new Date(),
              dataAtualizacao: inscricao.updatedAt?.toDate() || new Date(),
            };
          }
        })
      );
    } catch (error) {
      throw new BadRequestException('Erro ao buscar inscrições por atividade: ' + error.message);
    }
  }

  async findByStatus(status: StatusInscricao): Promise<Inscricao[]> {
    try {
      const inscricoes = await this.firebaseService.findWhere(
        this.collection,
        'status',
        '==',
        status
      );

      return inscricoes.map(inscricao => ({
        ...inscricao,
        dataInscricao: inscricao.createdAt?.toDate() || new Date(),
        dataAtualizacao: inscricao.updatedAt?.toDate() || new Date(),
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar inscrições por status: ' + error.message);
    }
  }

  async cancelarInscricao(id: string, motivo?: string): Promise<Inscricao> {
    try {
      const updateData: UpdateInscricaoDto = {
        status: StatusInscricao.CANCELADA,
      };

      if (motivo) {
        updateData.observacoes = motivo;
      }

      return await this.update(id, updateData);
    } catch (error) {
      throw new BadRequestException('Erro ao cancelar inscrição: ' + error.message);
    }
  }
}