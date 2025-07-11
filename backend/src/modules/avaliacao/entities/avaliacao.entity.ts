import { ApiProperty } from '@nestjs/swagger';
import { TipoAvaliacao } from '../dto/create-avaliacao.dto';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Atividade } from '../../atividade/entities/atividade.entity';

export class Avaliacao {
  @ApiProperty({ description: 'ID único da avaliação' })
  id: string;

  @ApiProperty({ description: 'ID do cliente que fez a avaliação' })
  clienteId: string;

  @ApiProperty({ description: 'ID da atividade avaliada', required: false })
  atividadeId?: string;

  @ApiProperty({ description: 'Tipo da avaliação', enum: TipoAvaliacao })
  tipo: TipoAvaliacao;

  @ApiProperty({ description: 'Título da avaliação' })
  titulo: string;

  @ApiProperty({ description: 'Descrição detalhada da avaliação' })
  descricao: string;

  @ApiProperty({ description: 'Nota de 1 a 5', required: false })
  nota?: number;

  @ApiProperty({ description: 'Unidade SESC relacionada', required: false })
  unidadeSesc?: string;

  @ApiProperty({ description: 'Resposta da administração', required: false })
  resposta?: string;

  @ApiProperty({ description: 'Data da resposta', required: false })
  dataResposta?: Date;

  @ApiProperty({ description: 'ID do administrador que respondeu', required: false })
  respondidoPor?: string;

  @ApiProperty({ description: 'Dados do cliente', required: false })
  cliente?: Cliente;

  @ApiProperty({ description: 'Dados da atividade', required: false })
  atividade?: Atividade;

  @ApiProperty({ description: 'Data de criação da avaliação' })
  dataCriacao: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  dataAtualizacao: Date;
}