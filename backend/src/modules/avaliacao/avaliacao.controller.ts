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
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto, TipoAvaliacao } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { Avaliacao } from './entities/avaliacao.entity';

@ApiTags('Avaliações')
@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova avaliação' })
  @ApiResponse({
    status: 201,
    description: 'Avaliação criada com sucesso',
    type: Avaliacao,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente ou atividade não encontrados' })
  create(@Body() createAvaliacaoDto: CreateAvaliacaoDto): Promise<Avaliacao> {
    return this.avaliacaoService.create(createAvaliacaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as avaliações' })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Incluir dados do cliente e atividade',
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    enum: TipoAvaliacao,
    description: 'Filtrar por tipo de avaliação',
  })
  @ApiQuery({
    name: 'unidade',
    required: false,
    type: String,
    description: 'Filtrar por unidade SESC',
  })
  @ApiQuery({
    name: 'clienteId',
    required: false,
    type: String,
    description: 'Filtrar por cliente',
  })
  @ApiQuery({
    name: 'atividadeId',
    required: false,
    type: String,
    description: 'Filtrar por atividade',
  })
  @ApiQuery({
    name: 'semResposta',
    required: false,
    type: Boolean,
    description: 'Filtrar avaliações sem resposta',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações',
    type: [Avaliacao],
  })
  async findAll(
    @Query('includeRelations') includeRelations?: boolean,
    @Query('tipo') tipo?: TipoAvaliacao,
    @Query('unidade') unidade?: string,
    @Query('clienteId') clienteId?: string,
    @Query('atividadeId') atividadeId?: string,
    @Query('semResposta') semResposta?: boolean,
  ): Promise<Avaliacao[]> {
    if (semResposta) {
      return this.avaliacaoService.findSemResposta();
    }
    
    if (clienteId) {
      return this.avaliacaoService.findByCliente(clienteId);
    }
    
    if (atividadeId) {
      return this.avaliacaoService.findByAtividade(atividadeId);
    }
    
    if (tipo) {
      return this.avaliacaoService.findByTipo(tipo);
    }
    
    if (unidade) {
      return this.avaliacaoService.findByUnidade(unidade);
    }

    return this.avaliacaoService.findAll(includeRelations || false);
  }

  @Get('estatisticas')
  @ApiOperation({ summary: 'Obter estatísticas das avaliações' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas das avaliações',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        porTipo: {
          type: 'object',
          properties: {
            criticas: { type: 'number' },
            sugestoes: { type: 'number' },
            elogios: { type: 'number' },
          },
        },
        respondidas: { type: 'number' },
        pendentes: { type: 'number' },
        notaMedia: { type: 'number' },
      },
    },
  })
  getEstatisticas() {
    return this.avaliacaoService.getEstatisticas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar avaliação por ID' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Incluir dados do cliente e atividade',
  })
  @ApiResponse({
    status: 200,
    description: 'Avaliação encontrada',
    type: Avaliacao,
  })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  findOne(
    @Param('id') id: string,
    @Query('includeRelations') includeRelations?: boolean,
  ): Promise<Avaliacao> {
    return this.avaliacaoService.findOne(id, includeRelations !== false);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar avaliação' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação atualizada com sucesso',
    type: Avaliacao,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateAvaliacaoDto: UpdateAvaliacaoDto,
  ): Promise<Avaliacao> {
    return this.avaliacaoService.update(id, updateAvaliacaoDto);
  }

  @Put(':id/responder')
  @ApiOperation({ summary: 'Responder a uma avaliação' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        resposta: {
          type: 'string',
          description: 'Resposta da administração',
        },
        respondidoPor: {
          type: 'string',
          description: 'ID do administrador que está respondendo',
        },
      },
      required: ['resposta', 'respondidoPor'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Resposta adicionada com sucesso',
    type: Avaliacao,
  })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  responderAvaliacao(
    @Param('id') id: string,
    @Body() body: { resposta: string; respondidoPor: string },
  ): Promise<Avaliacao> {
    return this.avaliacaoService.responderAvaliacao(
      id,
      body.resposta,
      body.respondidoPor,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir avaliação' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  remove(@Param('id') id: string): Promise<void> {
    return this.avaliacaoService.remove(id);
  }
}