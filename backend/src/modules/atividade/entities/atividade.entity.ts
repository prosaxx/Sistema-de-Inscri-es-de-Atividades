import { ApiProperty } from '@nestjs/swagger';
import { Responsavel } from '../../responsavel/entities/responsavel.entity';

export class Atividade {
  @ApiProperty({ description: 'ID único da atividade' })
  id: string;

  @ApiProperty({ description: 'Nome da atividade' })
  nomeAtividade: string;

  @ApiProperty({ description: 'Descrição detalhada da atividade' })
  descricao: string;

  @ApiProperty({ description: 'Unidade SESC onde a atividade será realizada' })
  unidadeSesc: string;

  @ApiProperty({ description: 'ID do responsável pela atividade' })
  responsavelId: string;

  @ApiProperty({ description: 'Dados do responsável pela atividade', required: false })
  responsavel?: Responsavel;

  @ApiProperty({ description: 'Número total de inscrições na atividade' })
  totalInscricoes?: number;

  @ApiProperty({ description: 'Data de criação do registro' })
  dataCriacao: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  dataAtualizacao: Date;
}