import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CepService, EnderecoResponse } from './cep.service';

@ApiTags('cep')
@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  @ApiOperation({ summary: 'Buscar endereço por CEP' })
  @ApiParam({ 
    name: 'cep', 
    description: 'CEP para busca (formato: 12345678 ou 12345-678)',
    example: '01310-100'
  })
  @ApiResponse({
    status: 200,
    description: 'Endereço encontrado com sucesso.',
    schema: {
      type: 'object',
      properties: {
        cep: { type: 'string', example: '01310-100' },
        logradouro: { type: 'string', example: 'Avenida Paulista' },
        bairro: { type: 'string', example: 'Bela Vista' },
        cidade: { type: 'string', example: 'São Paulo' },
        estado: { type: 'string', example: 'SP' },
        uf: { type: 'string', example: 'SP' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'CEP inválido ou não encontrado.',
  })
  async buscarEndereco(@Param('cep') cep: string): Promise<EnderecoResponse> {
    return await this.cepService.buscarEnderecoPorCep(cep);
  }

  @Get(':cep/validar')
  @ApiOperation({ summary: 'Validar se CEP existe' })
  @ApiParam({ 
    name: 'cep', 
    description: 'CEP para validação',
    example: '01310-100'
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado da validação.',
    schema: {
      type: 'object',
      properties: {
        valido: { type: 'boolean', example: true },
        cep: { type: 'string', example: '01310-100' },
      },
    },
  })
  async validarCep(@Param('cep') cep: string): Promise<{ valido: boolean; cep: string }> {
    const valido = await this.cepService.validarCep(cep);
    return { valido, cep };
  }
}