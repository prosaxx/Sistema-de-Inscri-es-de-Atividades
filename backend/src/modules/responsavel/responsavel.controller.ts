import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponsavelService } from './responsavel.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { Responsavel } from './entities/responsavel.entity';

@ApiTags('responsaveis')
@Controller('responsaveis')
export class ResponsavelController {
  constructor(private readonly responsavelService: ResponsavelService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo responsável' })
  @ApiResponse({
    status: 201,
    description: 'Responsável criado com sucesso.',
    type: Responsavel,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou matrícula já existe.',
  })
  async create(@Body() createResponsavelDto: CreateResponsavelDto): Promise<Responsavel> {
    return await this.responsavelService.create(createResponsavelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os responsáveis' })
  @ApiQuery({
    name: 'nome',
    required: false,
    description: 'Filtrar responsáveis por nome',
  })
  @ApiQuery({
    name: 'matricula',
    required: false,
    description: 'Buscar responsável por matrícula',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de responsáveis retornada com sucesso.',
    type: [Responsavel],
  })
  async findAll(
    @Query('nome') nome?: string,
    @Query('matricula') matricula?: string,
  ): Promise<Responsavel[]> {
    if (matricula) {
      const responsavel = await this.responsavelService.findByMatricula(matricula);
      return responsavel ? [responsavel] : [];
    }
    
    if (nome) {
      return await this.responsavelService.findByName(nome);
    }
    
    return await this.responsavelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar responsável por ID' })
  @ApiParam({ name: 'id', description: 'ID do responsável' })
  @ApiResponse({
    status: 200,
    description: 'Responsável encontrado.',
    type: Responsavel,
  })
  @ApiResponse({
    status: 404,
    description: 'Responsável não encontrado.',
  })
  async findOne(@Param('id') id: string): Promise<Responsavel> {
    return await this.responsavelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do responsável' })
  @ApiParam({ name: 'id', description: 'ID do responsável' })
  @ApiResponse({
    status: 200,
    description: 'Responsável atualizado com sucesso.',
    type: Responsavel,
  })
  @ApiResponse({
    status: 404,
    description: 'Responsável não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou matrícula já existe.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateResponsavelDto: UpdateResponsavelDto,
  ): Promise<Responsavel> {
    return await this.responsavelService.update(id, updateResponsavelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir responsável' })
  @ApiParam({ name: 'id', description: 'ID do responsável' })
  @ApiResponse({
    status: 204,
    description: 'Responsável excluído com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Responsável não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível excluir responsável com atividades vinculadas.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.responsavelService.remove(id);
  }
}