import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, Length, Matches } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nome completo do cliente', example: 'João Silva Santos' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nomeCliente: string;

  @ApiProperty({ description: 'Data de nascimento', example: '1990-05-15' })
  @IsDateString()
  dataNascimento: string;

  @ApiProperty({ description: 'Logradouro (rua, avenida, etc.)', example: 'Rua das Flores' })
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  logradouro: string;

  @ApiProperty({ description: 'Número do endereço', example: '123' })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({ description: 'Bairro', example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  bairro: string;

  @ApiProperty({ description: 'Cidade', example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  cidade: string;

  @ApiProperty({ description: 'Estado (UF)', example: 'SP' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve conter exatamente 2 letras maiúsculas' })
  estado: string;

  @ApiProperty({ description: 'CEP', example: '01234-567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP deve estar no formato 12345-678 ou 12345678' })
  cep: string;

  @ApiProperty({ description: 'Complemento do endereço', example: 'Apto 101', required: false })
  @IsOptional()
  @IsString()
  complemento?: string;
}