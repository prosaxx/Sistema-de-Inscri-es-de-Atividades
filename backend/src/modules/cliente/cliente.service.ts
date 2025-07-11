import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClienteService {
  private readonly collection = 'clientes';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      // Validar se já existe cliente com o mesmo nome e data de nascimento
      const existingClientes = await this.firebaseService.findWhere(
        this.collection,
        'nomeCliente',
        '==',
        createClienteDto.nomeCliente
      );

      const duplicateClient = existingClientes.find(
        cliente => cliente.dataNascimento === createClienteDto.dataNascimento
      );

      if (duplicateClient) {
        throw new BadRequestException('Já existe um cliente com este nome e data de nascimento');
      }

      const clienteData = {
        ...createClienteDto,
        dataCriacao: new Date(),
      };

      const id = await this.firebaseService.create(this.collection, clienteData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar cliente: ' + error.message);
    }
  }

  async findAll(): Promise<Cliente[]> {
    try {
      const clientes = await this.firebaseService.findAll(this.collection);
      return clientes.map(cliente => ({
        ...cliente,
        dataCriacao: cliente.createdAt?.toDate() || new Date(),
        dataAtualizacao: cliente.updatedAt?.toDate() || new Date(),
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar clientes: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Cliente> {
    try {
      const cliente = await this.firebaseService.findById(this.collection, id);
      if (!cliente) {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }

      return {
        ...cliente,
        dataCriacao: cliente.createdAt?.toDate() || new Date(),
        dataAtualizacao: cliente.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar cliente: ' + error.message);
    }
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    try {
      // Verificar se o cliente existe
      await this.findOne(id);

      // Se estiver atualizando nome ou data de nascimento, verificar duplicatas
      if (updateClienteDto.nomeCliente || updateClienteDto.dataNascimento) {
        const existingClientes = await this.firebaseService.findAll(this.collection);
        const duplicateClient = existingClientes.find(
          cliente => 
            cliente.id !== id &&
            cliente.nomeCliente === (updateClienteDto.nomeCliente || cliente.nomeCliente) &&
            cliente.dataNascimento === (updateClienteDto.dataNascimento || cliente.dataNascimento)
        );

        if (duplicateClient) {
          throw new BadRequestException('Já existe um cliente com este nome e data de nascimento');
        }
      }

      await this.firebaseService.update(this.collection, id, updateClienteDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar cliente: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verificar se o cliente existe
      await this.findOne(id);

      // Verificar se o cliente possui inscrições ativas
      const inscricoes = await this.firebaseService.findWhere('inscricoes', 'clienteId', '==', id);
      if (inscricoes.length > 0) {
        throw new BadRequestException('Não é possível excluir cliente com inscrições ativas');
      }

      await this.firebaseService.delete(this.collection, id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir cliente: ' + error.message);
    }
  }

  async findByName(nome: string): Promise<Cliente[]> {
    try {
      const clientes = await this.firebaseService.findWhere(
        this.collection,
        'nomeCliente',
        '>=',
        nome
      );

      return clientes
        .filter(cliente => 
          cliente.nomeCliente.toLowerCase().includes(nome.toLowerCase())
        )
        .map(cliente => ({
          ...cliente,
          dataCriacao: cliente.createdAt?.toDate() || new Date(),
          dataAtualizacao: cliente.updatedAt?.toDate() || new Date(),
        }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar clientes por nome: ' + error.message);
    }
  }
}