import { ApiProperty } from '@nestjs/swagger';

export class Cliente {
  @ApiProperty({ description: 'ID único do cliente' })
  id: string;

  @ApiProperty({ description: 'Nome completo do cliente' })
  nomeCliente: string;

  @ApiProperty({ description: 'Data de nascimento' })
  dataNascimento: string;

  @ApiProperty({ description: 'Logradouro (rua, avenida, etc.)' })
  logradouro: string;

  @ApiProperty({ description: 'Número do endereço' })
  numero: string;

  @ApiProperty({ description: 'Bairro' })
  bairro: string;

  @ApiProperty({ description: 'Cidade' })
  cidade: string;

  @ApiProperty({ description: 'Estado (UF)' })
  estado: string;

  @ApiProperty({ description: 'CEP' })
  cep: string;

  @ApiProperty({ description: 'Complemento do endereço', required: false })
  complemento?: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  dataCriacao: Date;

  @ApiProperty({ description: 'Data da última atualização' })
  dataAtualizacao: Date;
}