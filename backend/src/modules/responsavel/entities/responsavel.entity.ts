import { ApiProperty } from '@nestjs/swagger';

export class Responsavel {
  @ApiProperty({ description: 'ID único do responsável' })
  id: string;

  @ApiProperty({ description: 'Nome completo do responsável' })
  nomeResponsavel: string;

  @ApiProperty({ description: 'Matrícula do responsável' })
  matricula: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  dataCriacao: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  dataAtualizacao: Date;
}