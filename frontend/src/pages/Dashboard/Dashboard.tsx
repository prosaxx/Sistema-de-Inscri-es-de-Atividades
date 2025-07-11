import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  People,
  SportsEsports,
  Assignment,
  RateReview,
  PersonAdd,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {
  clienteService,
  responsavelService,
  atividadeService,
  inscricaoService,
  avaliacaoService,
  adminService,
} from '../../services/api';
import { EstatisticasAvaliacoes, Inscricao } from '../../types';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactElement;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCard> = ({ title, value, icon, color, loading }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {loading ? <CircularProgress size={24} /> : value.toLocaleString()}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            '& svg': {
              fontSize: 32,
            },
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const [estatisticasAvaliacoes, setEstatisticasAvaliacoes] = useState<EstatisticasAvaliacoes | null>(null);

  // Queries para buscar dados
  const { data: clientes, isLoading: loadingClientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getAll(),
  });

  const { data: responsaveis, isLoading: loadingResponsaveis } = useQuery({
    queryKey: ['responsaveis'],
    queryFn: () => responsavelService.getAll(),
  });

  const { data: atividades, isLoading: loadingAtividades } = useQuery({
    queryKey: ['atividades'],
    queryFn: () => atividadeService.getAll(),
  });

  const { data: inscricoes, isLoading: loadingInscricoes } = useQuery({
    queryKey: ['inscricoes'],
    queryFn: () => inscricaoService.getAll(),
  });

  const { data: admins, isLoading: loadingAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: () => adminService.getAll(),
  });

  // Buscar estatísticas de avaliações
  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const stats = await avaliacaoService.getEstatisticas();
        setEstatisticasAvaliacoes(stats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchEstatisticas();
  }, []);

  // Inscrições recentes (últimas 5)
  const inscricoesRecentes = inscricoes
    ?.sort((a, b) => new Date(b.dataInscricao).getTime() - new Date(a.dataInscricao).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return 'success';
      case 'PENDENTE':
        return 'warning';
      case 'CANCELADA':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Visão geral do sistema de inscrições SESC
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
        {/* Cards de estatísticas */}
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Total de Clientes"
            value={clientes?.length || 0}
            icon={<People />}
            color="#1976d2"
            loading={loadingClientes}
          />
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Responsáveis"
            value={responsaveis?.length || 0}
            icon={<PersonAdd />}
            color="#388e3c"
            loading={loadingResponsaveis}
          />
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Atividades"
            value={atividades?.length || 0}
            icon={<SportsEsports />}
            color="#f57c00"
            loading={loadingAtividades}
          />
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Inscrições"
            value={inscricoes?.length || 0}
            icon={<Assignment />}
            color="#7b1fa2"
            loading={loadingInscricoes}
          />
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Avaliações"
            value={estatisticasAvaliacoes?.total || 0}
            icon={<RateReview />}
            color="#d32f2f"
          />
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <StatCard
            title="Administradores"
            value={admins?.length || 0}
            icon={<AdminPanelSettings />}
            color="#455a64"
            loading={loadingAdmins}
          />
        </Box>

        {/* Estatísticas de Avaliações */}
        {estatisticasAvaliacoes && (
          <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estatísticas de Avaliações
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 150px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Respondidas
                    </Typography>
                    <Typography variant="h6">
                      {estatisticasAvaliacoes.respondidas}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 150px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pendentes
                    </Typography>
                    <Typography variant="h6">
                      {estatisticasAvaliacoes.pendentes}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 150px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Nota Média
                    </Typography>
                    <Typography variant="h6">
                      {estatisticasAvaliacoes.notaMedia?.toFixed(1) || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 150px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Por Tipo
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {Object.entries(estatisticasAvaliacoes.porTipo).map(([tipo, count]) => (
                        <Chip
                          key={tipo}
                          label={`${tipo}: ${count}`}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Inscrições Recentes */}
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inscrições Recentes
              </Typography>
              {loadingInscricoes ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : inscricoesRecentes && inscricoesRecentes.length > 0 ? (
                <List>
                  {inscricoesRecentes.map((inscricao) => (
                    <ListItem key={inscricao.id} divider>
                      <ListItemText
                        primary={`Cliente: ${inscricao.clienteId}`}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR')}
                            </Typography>
                            <Chip
                              label={inscricao.status}
                              size="small"
                              color={getStatusColor(inscricao.status) as any}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  Nenhuma inscrição encontrada
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;