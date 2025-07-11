import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

export interface EnderecoResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  uf: string;
}

@Injectable()
export class CepService {
  async buscarEnderecoPorCep(cep: string): Promise<EnderecoResponse> {
    // Limpar e validar CEP
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      throw new BadRequestException('CEP deve conter exatamente 8 dígitos');
    }

    try {
      // Tentar primeiro com ViaCEP
      const enderecoViaCep = await this.buscarViaCep(cepLimpo);
      if (enderecoViaCep) {
        return enderecoViaCep;
      }

      // Se ViaCEP falhar, tentar Postmon
      const enderecoPostmon = await this.buscarPostmon(cepLimpo);
      if (enderecoPostmon) {
        return enderecoPostmon;
      }

      throw new BadRequestException('CEP não encontrado em nenhum serviço');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar CEP: ' + error.message);
    }
  }

  private async buscarViaCep(cep: string): Promise<EnderecoResponse | null> {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`, {
        timeout: 5000,
      });

      if (response.data.erro) {
        return null;
      }

      return {
        cep: response.data.cep,
        logradouro: response.data.logradouro,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        estado: response.data.uf,
        uf: response.data.uf,
      };
    } catch (error) {
      console.log('Erro no ViaCEP:', error.message);
      return null;
    }
  }

  private async buscarPostmon(cep: string): Promise<EnderecoResponse | null> {
    try {
      const response = await axios.get(`https://api.postmon.com.br/v1/cep/${cep}`, {
        timeout: 5000,
      });

      return {
        cep: response.data.cep,
        logradouro: response.data.logradouro,
        bairro: response.data.district,
        cidade: response.data.city,
        estado: response.data.state,
        uf: response.data.state,
      };
    } catch (error) {
      console.log('Erro no Postmon:', error.message);
      return null;
    }
  }

  async validarCep(cep: string): Promise<boolean> {
    try {
      await this.buscarEnderecoPorCep(cep);
      return true;
    } catch {
      return false;
    }
  }
}