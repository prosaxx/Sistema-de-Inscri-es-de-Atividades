import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';

export class CreateAtividadeDto {
  @ApiProperty({ description: 'Nome da atividade', example: 'Natação Infantil' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  nomeAtividade: string;

  @ApiProperty({ 
    description: 'Descrição detalhada da atividade', 
    example: 'Aulas de natação para crianças de 6 a 12 anos, focando no desenvolvimento motor e técnicas básicas de nado.' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  descricao: string;

  @ApiProperty({ 
    description: 'Unidade SESC onde a atividade será realizada', 
    example: 'SESC Pompeia' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  unidadeSesc: string;

  @ApiProperty({ description: 'ID do responsável pela atividade' })
  @IsString()
  @IsNotEmpty()
  responsavelId: string;
}