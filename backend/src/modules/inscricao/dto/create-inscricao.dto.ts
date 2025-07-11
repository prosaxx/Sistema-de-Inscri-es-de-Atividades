import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';

export enum StatusInscricao {
  ATIVA = 'ativa',
  CANCELADA = 'cancelada',
  CONCLUIDA = 'concluida',
  PENDENTE = 'pendente',
}

export class CreateInscricaoDto {
  @ApiProperty({ description: 'ID do cliente que está se inscrevendo' })
  @IsString()
  @IsNotEmpty()
  clienteId: string;

  @ApiProperty({ description: 'ID da atividade na qual o cliente está se inscrevendo' })
  @IsString()
  @IsNotEmpty()
  atividadeId: string;

  @ApiProperty({ 
    description: 'Data de início da participação na atividade', 
    example: '2024-02-01' 
  })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({ 
    description: 'Data de fim da participação na atividade (opcional)', 
    example: '2024-12-31',
    required: false 
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiProperty({ 
    description: 'Status da inscrição',
    enum: StatusInscricao,
    default: StatusInscricao.ATIVA
  })
  @IsOptional()
  @IsEnum(StatusInscricao)
  status?: StatusInscricao;

  @ApiProperty({ 
    description: 'Observações sobre a inscrição',
    required: false,
    example: 'Cliente possui restrições alimentares'
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}