import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateResponsavelDto {
  @ApiProperty({ description: 'Nome completo do responsável', example: 'Maria Silva Santos' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nomeResponsavel: string;

  @ApiProperty({ description: 'Matrícula do responsável', example: 'RESP001' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @Matches(/^[A-Z0-9]+$/, { message: 'Matrícula deve conter apenas letras maiúsculas e números' })
  matricula: string;
}