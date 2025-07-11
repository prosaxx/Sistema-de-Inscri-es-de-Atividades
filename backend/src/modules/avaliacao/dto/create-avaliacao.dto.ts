import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';

export enum TipoAvaliacao {
  CRITICA = 'critica',
  SUGESTAO = 'sugestao',
  ELOGIO = 'elogio',
}

export class CreateAvaliacaoDto {
  @ApiProperty({ description: 'ID do cliente que está fazendo a avaliação' })
  @IsString()
  @IsNotEmpty()
  clienteId: string;

  @ApiProperty({ 
    description: 'ID da atividade sendo avaliada (opcional)', 
    required: false 
  })
  @IsOptional()
  @IsString()
  atividadeId?: string;

  @ApiProperty({ 
    description: 'Tipo da avaliação',
    enum: TipoAvaliacao,
    example: TipoAvaliacao.ELOGIO
  })
  @IsEnum(TipoAvaliacao)
  tipo: TipoAvaliacao;

  @ApiProperty({ 
    description: 'Título da avaliação', 
    example: 'Excelente atendimento' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  titulo: string;

  @ApiProperty({ 
    description: 'Descrição detalhada da avaliação', 
    example: 'Gostaria de parabenizar toda a equipe pelo excelente atendimento prestado durante as atividades.' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  descricao: string;

  @ApiProperty({ 
    description: 'Nota de 1 a 5 (opcional)', 
    minimum: 1,
    maximum: 5,
    required: false 
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  nota?: number;

  @ApiProperty({ 
    description: 'Unidade SESC relacionada à avaliação (opcional)', 
    required: false,
    example: 'SESC Pompeia' 
  })
  @IsOptional()
  @IsString()
  @Length(5, 100)
  unidadeSesc?: string;
}