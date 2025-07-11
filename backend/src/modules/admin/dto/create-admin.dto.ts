import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ description: 'Nome do administrador' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nomeAdmin: string;

  @ApiProperty({ description: 'Email do administrador' })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({ description: 'Senha do administrador (mínimo 6 caracteres)' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha: string;

  @ApiProperty({ description: 'Matrícula do administrador (apenas letras maiúsculas e números)' })
  @IsString({ message: 'Matrícula deve ser uma string' })
  @IsNotEmpty({ message: 'Matrícula é obrigatória' })
  @Matches(/^[A-Z0-9]+$/, { message: 'Matrícula deve conter apenas letras maiúsculas e números' })
  matricula: string;

  @ApiProperty({ description: 'Cargo do administrador', required: false })
  @IsString({ message: 'Cargo deve ser uma string' })
  cargo?: string;

  @ApiProperty({ description: 'Unidade SESC do administrador', required: false })
  @IsString({ message: 'Unidade SESC deve ser uma string' })
  unidadeSesc?: string;
}