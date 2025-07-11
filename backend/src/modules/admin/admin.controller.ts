import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@ApiTags('Administradores')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo administrador' })
  @ApiResponse({
    status: 201,
    description: 'Administrador criado com sucesso',
    type: Admin,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email ou matrícula já existem' })
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(createAdminDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login do administrador' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email do administrador',
        },
        senha: {
          type: 'string',
          description: 'Senha do administrador',
        },
      },
      required: ['email', 'senha'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: Admin,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(
    @Body() loginDto: { email: string; senha: string },
  ): Promise<Admin | { message: string }> {
    const admin = await this.adminService.validarCredenciais(
      loginDto.email,
      loginDto.senha,
    );
    
    if (!admin) {
      return { message: 'Credenciais inválidas' };
    }
    
    return admin;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os administradores' })
  @ApiQuery({
    name: 'nome',
    required: false,
    type: String,
    description: 'Filtrar por nome do administrador',
  })
  @ApiQuery({
    name: 'matricula',
    required: false,
    type: String,
    description: 'Filtrar por matrícula',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de administradores',
    type: [Admin],
  })
  async findAll(
    @Query('nome') nome?: string,
    @Query('matricula') matricula?: string,
  ): Promise<Admin[]> {
    if (nome) {
      return this.adminService.findByNome(nome);
    }
    
    if (matricula) {
      return this.adminService.findByMatricula(matricula);
    }

    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar administrador por ID' })
  @ApiParam({ name: 'id', description: 'ID do administrador' })
  @ApiResponse({
    status: 200,
    description: 'Administrador encontrado',
    type: Admin,
  })
  @ApiResponse({ status: 404, description: 'Administrador não encontrado' })
  findOne(@Param('id') id: string): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar administrador' })
  @ApiParam({ name: 'id', description: 'ID do administrador' })
  @ApiResponse({
    status: 200,
    description: 'Administrador atualizado com sucesso',
    type: Admin,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Administrador não encontrado' })
  @ApiResponse({ status: 409, description: 'Email ou matrícula já existem' })
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return this.adminService.update(id, updateAdminDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Ativar/Desativar administrador' })
  @ApiParam({ name: 'id', description: 'ID do administrador' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ativo: {
          type: 'boolean',
          description: 'Status ativo/inativo',
        },
      },
      required: ['ativo'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
    type: Admin,
  })
  @ApiResponse({ status: 404, description: 'Administrador não encontrado' })
  alterarStatus(
    @Param('id') id: string,
    @Body() body: { ativo: boolean },
  ): Promise<Admin> {
    return this.adminService.ativarDesativar(id, body.ativo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir administrador' })
  @ApiParam({ name: 'id', description: 'ID do administrador' })
  @ApiResponse({ status: 200, description: 'Administrador excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Administrador não encontrado' })
  remove(@Param('id') id: string): Promise<void> {
    return this.adminService.remove(id);
  }
}