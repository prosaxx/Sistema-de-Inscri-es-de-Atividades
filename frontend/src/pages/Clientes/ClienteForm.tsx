import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService, cepService } from '../../services/api';
import { CreateClienteDto, UpdateClienteDto } from '../../types';
import dayjs from 'dayjs';



const ClienteForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<{
    nomeCliente: string;
    dataNascimento: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento: string;
  }>({
    nomeCliente: '',
    dataNascimento: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cepLoading, setCepLoading] = useState(false);

  // Buscar cliente para edição
  const { data: cliente, isLoading: loadingCliente } = useQuery({
    queryKey: ['cliente', id],
    queryFn: () => clienteService.getById(id!),
    enabled: isEditing,
  });

  // Preencher formulário quando cliente for carregado
  useEffect(() => {
    if (cliente) {
      setFormData({
        nomeCliente: cliente.nomeCliente,
        dataNascimento: dayjs(cliente.dataNascimento).format('YYYY-MM-DD'),
        logradouro: cliente.logradouro,
        numero: cliente.numero,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        estado: cliente.estado,
        cep: cliente.cep,
        complemento: cliente.complemento || '',
      });
    }
  }, [cliente]);

  // Mutation para criar/atualizar cliente
  const mutation = useMutation({
    mutationFn: (data: CreateClienteDto | UpdateClienteDto) => {
      if (isEditing) {
        return clienteService.update(id!, data as UpdateClienteDto);
      } else {
        return clienteService.create(data as CreateClienteDto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      navigate('/clientes');
    },
    onError: (error: any) => {
      console.error('Erro ao salvar cliente:', error);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEnderecoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCepChange = async (cep: string) => {
    handleEnderecoChange('cep', cep);
    
    // Buscar endereço pelo CEP quando tiver 8 dígitos
    if (cep.replace(/\D/g, '').length === 8) {
      setCepLoading(true);
      try {
        const endereco = await cepService.buscarEndereco(cep);
        if (endereco && !(endereco as any).erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: endereco.logradouro || '',
            bairro: endereco.bairro || '',
            cidade: endereco.localidade || '',
            estado: endereco.uf || '',
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCliente.trim()) {
      newErrors.nomeCliente = 'Nome do cliente é obrigatório';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    }

    if (!formData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  if (isEditing && loadingCliente) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/clientes')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4">
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        </Typography>
      </Box>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao salvar cliente. Verifique os dados e tente novamente.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Dados Pessoais */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Dados Pessoais
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    fullWidth
                    label="Nome do Cliente"
                    value={formData.nomeCliente}
                    onChange={(e) => handleInputChange('nomeCliente', e.target.value)}
                    error={!!errors.nomeCliente}
                    helperText={errors.nomeCliente}
                    required
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                    error={!!errors.dataNascimento}
                    helperText={errors.dataNascimento}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Box>
              </Box>

              {/* Endereço */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Endereço
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={formData.cep}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const formatted = value.replace(/(\d{5})(\d{3})/, '$1-$2');
                      handleCepChange(formatted);
                    }}
                    error={!!errors.cep}
                    helperText={errors.cep}
                    inputProps={{ maxLength: 9 }}
                    InputProps={{
                      endAdornment: cepLoading && <CircularProgress size={20} />,
                    }}
                    required
                  />
                </Box>

                <Box sx={{ flex: '2 1 400px' }}>
                  <TextField
                    fullWidth
                    label="Logradouro"
                    value={formData.logradouro}
                    onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                    error={!!errors.logradouro}
                    helperText={errors.logradouro}
                    required
                  />
                </Box>

                <Box sx={{ flex: '1 1 150px' }}>
                  <TextField
                    fullWidth
                    label="Número"
                    value={formData.numero}
                    onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                    error={!!errors.numero}
                    helperText={errors.numero}
                    required
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 250px' }}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    value={formData.complemento}
                    onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                  />
                </Box>

                <Box sx={{ flex: '1 1 250px' }}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={formData.bairro}
                    onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                    error={!!errors.bairro}
                    helperText={errors.bairro}
                    required
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={formData.cidade}
                    onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                    error={!!errors.cidade}
                    helperText={errors.cidade}
                    required
                  />
                </Box>

                <Box sx={{ flex: '0 1 100px' }}>
                  <TextField
                    fullWidth
                    label="Estado"
                    value={formData.estado}
                    onChange={(e) => handleEnderecoChange('estado', e.target.value.toUpperCase())}
                    error={!!errors.estado}
                    helperText={errors.estado}
                    inputProps={{ maxLength: 2 }}
                    required
                  />
                </Box>
              </Box>

              {/* Botões */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/clientes')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    isEditing ? 'Atualizar' : 'Salvar'
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClienteForm;