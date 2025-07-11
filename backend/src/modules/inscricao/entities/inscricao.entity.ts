import { ApiProperty } from '@nestjs/swagger';
import { StatusInscricao } from '../dto/create-inscricao.dto';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Atividade } from '../../atividade/entities/atividade.entity';

export class Inscricao {
  @ApiProperty({ description: 'ID único da inscrição' })
  id: string;

  @ApiProperty({ description: 'ID do cliente inscrito' })
  clienteId: string;

  @ApiProperty({ description: 'ID da atividade' })
  atividadeId: string;

  @ApiProperty({ description: 'Data de início da participação' })
  dataInicio: string;

  @ApiProperty({ description: 'Data de fim da participação', required: false })
  dataFim?: string;

  @ApiProperty({ description: 'Status da inscrição', enum: StatusInscricao })
  status: StatusInscricao;

  @ApiProperty({ description: 'Observações sobre a inscrição', required: false })
  observacoes?: string;

  @ApiProperty({ description: 'Dados do cliente', required: false })
  cliente?: Cliente;

  @ApiProperty({ description: 'Dados da atividade', required: false })
  atividade?: Atividade;

  @ApiProperty({ description: 'Data de criação da inscrição' })
  dataInscricao: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  dataAtualizacao: Date;
}