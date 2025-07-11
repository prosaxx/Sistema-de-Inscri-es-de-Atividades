import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { clienteService } from '../../services/api';
import { Cliente } from '../../types';
import dayjs from 'dayjs';

const ClientesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [clienteToView, setClienteToView] = useState<Cliente | null>(null);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: clientes, isLoading, error } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setDeleteDialogOpen(false);
      setClienteToDelete(null);
    },
  });

  const filteredClientes = clientes?.filter((cliente) =>
    cliente.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
  };

  const handleView = (cliente: Cliente) => {
    setClienteToView(cliente);
    setViewDialogOpen(true);
  };

  const confirmDelete = () => {
    if (clienteToDelete) {
      deleteMutation.mutate(clienteToDelete.id);
    }
  };

  const getIdadeColor = (dataNascimento: string | Date) => {
    const idade = dayjs().diff(dayjs(dataNascimento), 'year');
    if (idade < 18) return 'primary';
    if (idade < 60) return 'success';
    return 'warning';
  };

  const getIdade = (dataNascimento: string | Date) => {
    return dayjs().diff(dayjs(dataNascimento), 'year');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Erro ao carregar clientes. Tente novamente.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Clientes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/clientes/novo')}
        >
          Novo Cliente
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total de clientes: {filteredClientes?.length || 0}
          </Typography>
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Data de Nascimento</TableCell>
                  <TableCell>Idade</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClientes?.map((cliente) => (
                  <TableRow key={cliente.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {cliente.nomeCliente}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {dayjs(cliente.dataNascimento).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${getIdade(cliente.dataNascimento)} anos`}
                        size="small"
                        color={getIdadeColor(cliente.dataNascimento) as any}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Visualizar">
                          <IconButton
                            size="small"
                            onClick={() => handleView(cliente)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(cliente)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredClientes?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">
                        Nenhum cliente encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Visualização */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes do Cliente</DialogTitle>
        <DialogContent>
          {clienteToView && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Nome Completo
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {clienteToView.nomeCliente}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Data de Nascimento
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {dayjs(clienteToView.dataNascimento).format('DD/MM/YYYY')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Idade
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {getIdade(clienteToView.dataNascimento)} anos
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Data de Criação
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {dayjs(clienteToView.dataCriacao).format('DD/MM/YYYY HH:mm')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Última Atualização
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {dayjs(clienteToView.dataAtualizacao).format('DD/MM/YYYY HH:mm')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Fechar</Button>
          <Button
            variant="contained"
            onClick={() => {
              setViewDialogOpen(false);
              if (clienteToView) {
                navigate(`/clientes/${clienteToView.id}/editar`);
              }
            }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o cliente <strong>{clienteToDelete?.nomeCliente}</strong>?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientesList;