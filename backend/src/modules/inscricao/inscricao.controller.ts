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
import { InscricaoService } from './inscricao.service';
import { CreateInscricaoDto, StatusInscricao } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { Inscricao } from './entities/inscricao.entity';

@ApiTags('inscricoes')
@Controller('inscricoes')
export class InscricaoController {
  constructor(private readonly inscricaoService: InscricaoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova inscrição' })
  @ApiResponse({
    status: 201,
    description: 'Inscrição criada com sucesso.',
    type: Inscricao,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou cliente já inscrito na atividade.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente ou atividade não encontrado.',
  })
  async create(@Body() createInscricaoDto: CreateInscricaoDto): Promise<Inscricao> {
    return await this.inscricaoService.create(createInscricaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as inscrições' })
  @ApiQuery({
    name: 'cliente',
    required: false,
    description: 'Filtrar inscrições por ID do cliente',
  })
  @ApiQuery({
    name: 'atividade',
    required: false,
    description: 'Filtrar inscrições por ID da atividade',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar inscrições por status',
    enum: StatusInscricao,
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    description: 'Incluir dados do cliente e atividade na resposta',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de inscrições retornada com sucesso.',
    type: [Inscricao],
  })
  async findAll(
    @Query('cliente') cliente?: string,
    @Query('atividade') atividade?: string,
    @Query('status') status?: StatusInscricao,
    @Query('includeRelations') includeRelations?: boolean,
  ): Promise<Inscricao[]> {
    if (cliente) {
      return await this.inscricaoService.findByCliente(cliente);
    }
    
    if (atividade) {
      return await this.inscricaoService.findByAtividade(atividade);
    }
    
    if (status) {
      return await this.inscricaoService.findByStatus(status);
    }
    
    return await this.inscricaoService.findAll(includeRelations);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar inscrição por ID' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    description: 'Incluir dados do cliente e atividade na resposta',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Inscrição encontrada.',
    type: Inscricao,
  })
  @ApiResponse({
    status: 404,
    description: 'Inscrição não encontrada.',
  })
  async findOne(
    @Param('id') id: string,
    @Query('includeRelations') includeRelations?: boolean,
  ): Promise<Inscricao> {
    return await this.inscricaoService.findOne(id, includeRelations);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({
    status: 200,
    description: 'Inscrição atualizada com sucesso.',
    type: Inscricao,
  })
  @ApiResponse({
    status: 404,
    description: 'Inscrição, cliente ou atividade não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou cliente já inscrito na atividade.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateInscricaoDto: UpdateInscricaoDto,
  ): Promise<Inscricao> {
    return await this.inscricaoService.update(id, updateInscricaoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({
    status: 204,
    description: 'Inscrição excluída com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Inscrição não encontrada.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.inscricaoService.remove(id);
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({
    status: 200,
    description: 'Inscrição cancelada com sucesso.',
    type: Inscricao,
  })
  @ApiResponse({
    status: 404,
    description: 'Inscrição não encontrada.',
  })
  async cancelar(
    @Param('id') id: string,
    @Body() body?: { motivo?: string },
  ): Promise<Inscricao> {
    return await this.inscricaoService.cancelarInscricao(id, body?.motivo);
  }
}