import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private readonly collection = 'admins';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      // Verificar se já existe admin com o mesmo email
      const adminExistenteEmail = await this.firebaseService.findWhere(
        this.collection,
        'email',
        '==',
        createAdminDto.email
      );

      if (adminExistenteEmail.length > 0) {
        throw new ConflictException('Já existe um administrador com este email');
      }

      // Verificar se já existe admin com a mesma matrícula
      const adminExistenteMatricula = await this.firebaseService.findWhere(
        this.collection,
        'matricula',
        '==',
        createAdminDto.matricula
      );

      if (adminExistenteMatricula.length > 0) {
        throw new ConflictException('Já existe um administrador com esta matrícula');
      }

      // Criptografar a senha
      const senhaHash = await bcrypt.hash(createAdminDto.senha, 10);

      const adminData = {
        ...createAdminDto,
        senha: senhaHash,
        ativo: true,
        dataCriacao: new Date(),
      };

      const id = await this.firebaseService.create(this.collection, adminData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar administrador: ' + error.message);
    }
  }

  async findAll(): Promise<Admin[]> {
    try {
      const admins = await this.firebaseService.findAll(this.collection);
      
      return admins.map(admin => ({
        ...admin,
        dataCriacao: admin.createdAt?.toDate() || new Date(),
        dataAtualizacao: admin.updatedAt?.toDate() || new Date(),
        ultimoLogin: admin.ultimoLogin?.toDate(),
        // Não retornar a senha
        senha: undefined,
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar administradores: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Admin> {
    try {
      const admin = await this.firebaseService.findById(this.collection, id);
      if (!admin) {
        throw new NotFoundException(`Administrador com ID ${id} não encontrado`);
      }

      return {
        ...admin,
        dataCriacao: admin.createdAt?.toDate() || new Date(),
        dataAtualizacao: admin.updatedAt?.toDate() || new Date(),
        ultimoLogin: admin.ultimoLogin?.toDate(),
        // Não retornar a senha
        senha: undefined,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar administrador: ' + error.message);
    }
  }

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const admins = await this.firebaseService.findWhere(
        this.collection,
        'email',
        '==',
        email
      );

      if (admins.length === 0) {
        return null;
      }

      const admin = admins[0];
      return {
        ...admin,
        dataCriacao: admin.createdAt?.toDate() || new Date(),
        dataAtualizacao: admin.updatedAt?.toDate() || new Date(),
        ultimoLogin: admin.ultimoLogin?.toDate(),
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar administrador por email: ' + error.message);
    }
  }

  async findByMatricula(matricula: string): Promise<Admin[]> {
    try {
      const admins = await this.firebaseService.findWhere(
        this.collection,
        'matricula',
        '==',
        matricula
      );

      return admins.map(admin => ({
        ...admin,
        dataCriacao: admin.createdAt?.toDate() || new Date(),
        dataAtualizacao: admin.updatedAt?.toDate() || new Date(),
        ultimoLogin: admin.ultimoLogin?.toDate(),
        // Não retornar a senha
        senha: undefined,
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar administrador por matrícula: ' + error.message);
    }
  }

  async findByNome(nome: string): Promise<Admin[]> {
    try {
      const todosAdmins = await this.firebaseService.findAll(this.collection);
      
      const adminsFiltrados = todosAdmins.filter(admin =>
        admin.nomeAdmin.toLowerCase().includes(nome.toLowerCase())
      );

      return adminsFiltrados.map(admin => ({
        ...admin,
        dataCriacao: admin.createdAt?.toDate() || new Date(),
        dataAtualizacao: admin.updatedAt?.toDate() || new Date(),
        ultimoLogin: admin.ultimoLogin?.toDate(),
        // Não retornar a senha
        senha: undefined,
      }));
    } catch (error) {
      throw new BadRequestException('Erro ao buscar administradores por nome: ' + error.message);
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    try {
      // Verificar se o admin existe
      await this.findOne(id);

      // Se estiver atualizando email, verificar duplicidade
      if (updateAdminDto.email) {
        const adminExistenteEmail = await this.firebaseService.findWhere(
          this.collection,
          'email',
          '==',
          updateAdminDto.email
        );

        if (adminExistenteEmail.length > 0 && adminExistenteEmail[0].id !== id) {
          throw new ConflictException('Já existe um administrador com este email');
        }
      }

      // Se estiver atualizando matrícula, verificar duplicidade
      if (updateAdminDto.matricula) {
        const adminExistenteMatricula = await this.firebaseService.findWhere(
          this.collection,
          'matricula',
          '==',
          updateAdminDto.matricula
        );

        if (adminExistenteMatricula.length > 0 && adminExistenteMatricula[0].id !== id) {
          throw new ConflictException('Já existe um administrador com esta matrícula');
        }
      }

      const updateData = { ...updateAdminDto };

      // Se estiver atualizando senha, criptografar
      if (updateAdminDto.senha) {
        updateData.senha = await bcrypt.hash(updateAdminDto.senha, 10);
      }

      await this.firebaseService.update(this.collection, id, updateData);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar administrador: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Verificar se o admin existe
      await this.findOne(id);

      await this.firebaseService.delete(this.collection, id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir administrador: ' + error.message);
    }
  }

  async ativarDesativar(id: string, ativo: boolean): Promise<Admin> {
    try {
      await this.firebaseService.update(this.collection, id, { ativo });
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException('Erro ao alterar status do administrador: ' + error.message);
    }
  }

  async registrarLogin(id: string): Promise<void> {
    try {
      await this.firebaseService.update(this.collection, id, {
        ultimoLogin: new Date(),
      });
    } catch (error) {
      throw new BadRequestException('Erro ao registrar login: ' + error.message);
    }
  }

  async validarCredenciais(email: string, senha: string): Promise<Admin | null> {
    try {
      const admin = await this.findByEmail(email);
      
      if (!admin || !admin.ativo) {
        return null;
      }

      // Buscar admin com senha para validação
      const adminComSenha = await this.firebaseService.findWhere(
        this.collection,
        'email',
        '==',
        email
      );

      if (adminComSenha.length === 0) {
        return null;
      }

      const senhaValida = await bcrypt.compare(senha, adminComSenha[0].senha);
      
      if (!senhaValida) {
        return null;
      }

      // Registrar login
      await this.registrarLogin(admin.id);

      return admin;
    } catch (error) {
      throw new BadRequestException('Erro ao validar credenciais: ' + error.message);
    }
  }
}