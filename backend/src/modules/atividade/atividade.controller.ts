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
import { AtividadeService } from './atividade.service';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { Atividade } from './entities/atividade.entity';

@ApiTags('atividades')
@Controller('atividades')
export class AtividadeController {
  constructor(private readonly atividadeService: AtividadeService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova atividade' })
  @ApiResponse({
    status: 201,
    description: 'Atividade criada com sucesso.',
    type: Atividade,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou atividade já existe na unidade.',
  })
  @ApiResponse({
    status: 404,
    description: 'Responsável não encontrado.',
  })
  async create(@Body() createAtividadeDto: CreateAtividadeDto): Promise<Atividade> {
    return await this.atividadeService.create(createAtividadeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as atividades' })
  @ApiQuery({
    name: 'unidade',
    required: false,
    description: 'Filtrar atividades por unidade SESC',
  })
  @ApiQuery({
    name: 'responsavel',
    required: false,
    description: 'Filtrar atividades por ID do responsável',
  })
  @ApiQuery({
    name: 'nome',
    required: false,
    description: 'Filtrar atividades por nome',
  })
  @ApiQuery({
    name: 'includeResponsavel',
    required: false,
    description: 'Incluir dados do responsável na resposta',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de atividades retornada com sucesso.',
    type: [Atividade],
  })
  async findAll(
    @Query('unidade') unidade?: string,
    @Query('responsavel') responsavel?: string,
    @Query('nome') nome?: string,
    @Query('includeResponsavel') includeResponsavel?: boolean,
  ): Promise<Atividade[]> {
    if (unidade) {
      return await this.atividadeService.findByUnidade(unidade);
    }
    
    if (responsavel) {
      return await this.atividadeService.findByResponsavel(responsavel);
    }
    
    if (nome) {
      return await this.atividadeService.findByName(nome);
    }
    
    return await this.atividadeService.findAll(includeResponsavel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar atividade por ID' })
  @ApiParam({ name: 'id', description: 'ID da atividade' })
  @ApiQuery({
    name: 'includeResponsavel',
    required: false,
    description: 'Incluir dados do responsável na resposta',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Atividade encontrada.',
    type: Atividade,
  })
  @ApiResponse({
    status: 404,
    description: 'Atividade não encontrada.',
  })
  async findOne(
    @Param('id') id: string,
    @Query('includeResponsavel') includeResponsavel?: boolean,
  ): Promise<Atividade> {
    return await this.atividadeService.findOne(id, includeResponsavel);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da atividade' })
  @ApiParam({ name: 'id', description: 'ID da atividade' })
  @ApiResponse({
    status: 200,
    description: 'Atividade atualizada com sucesso.',
    type: Atividade,
  })
  @ApiResponse({
    status: 404,
    description: 'Atividade ou responsável não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou atividade já existe na unidade.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAtividadeDto: UpdateAtividadeDto,
  ): Promise<Atividade> {
    return await this.atividadeService.update(id, updateAtividadeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir atividade' })
  @ApiParam({ name: 'id', description: 'ID da atividade' })
  @ApiResponse({
    status: 204,
    description: 'Atividade excluída com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Atividade não encontrada.',
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possível excluir atividade com inscrições ativas.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.atividadeService.remove(id);
  }
}