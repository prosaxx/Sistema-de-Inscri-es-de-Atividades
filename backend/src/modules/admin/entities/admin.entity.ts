import { ApiProperty } from '@nestjs/swagger';

export class Admin {
  @ApiProperty({ description: 'ID único do administrador' })
  id: string;

  @ApiProperty({ description: 'Nome do administrador' })
  nomeAdmin: string;

  @ApiProperty({ description: 'Email do administrador' })
  email: string;

  @ApiProperty({ description: 'Matrícula do administrador' })
  matricula: string;

  @ApiProperty({ description: 'Cargo do administrador', required: false })
  cargo?: string;

  @ApiProperty({ description: 'Unidade SESC do administrador', required: false })
  unidadeSesc?: string;

  @ApiProperty({ description: 'Data de criação do administrador' })
  dataCriacao: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  dataAtualizacao: Date;

  @ApiProperty({ description: 'Data do último login', required: false })
  ultimoLogin?: Date;

  @ApiProperty({ description: 'Status ativo/inativo do administrador' })
  ativo: boolean;
}