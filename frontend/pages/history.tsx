// Page d'historique des parties
// Affiche la liste des parties jouées par l'utilisateur connecté
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { Box, Heading, Text, Stack, Spinner, Badge, Flex, Alert, AlertIcon } from '@chakra-ui/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Game {
  _id: string;
  generatedNumber: number;
  result: string;
  balanceChange: number;
  newBalance: number;
  date: string;
}

export default function History() {
  // Gestion de l'utilisateur et de l'historique
  const { user } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);

  // Redirige l'utilisateur non connecté vers la page de connexion
  useEffect(() => {
    if (user === null) return; // attendre que user soit chargé
    if (!user) {
      router.replace('/login');
    } else {
      setChecking(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (!checking && user) {
      const fetchHistory = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await fetch(`${API_URL}/api/history/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (!res.ok) throw new Error('Erreur lors de la récupération de l\'historique');
          const data = await res.json();
          setGames(data);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [checking, user]);

  if (checking) return <Flex minH="70vh" align="center" justify="center"><Spinner size="lg" color="teal.500" /></Flex>;
  if (!user) return <p>Redirection...</p>;

  return (
    <Box maxW="600px" mx="auto" py={8}>
      <Heading as="h2" size="lg" color="teal.500" mb={6} textAlign="center">Historique de vos parties</Heading>
      {loading && <Flex justify="center" align="center" minH="100px"><Spinner size="lg" color="teal.500" /></Flex>}
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      {!loading && games.length === 0 && <Text color="gray.500" textAlign="center">Aucune partie jouée pour le moment.</Text>}
      <Stack gap={4}>
        {games.map(game => (
          <Box key={game._id} borderWidth={1} borderRadius="md" p={4} bg={game.result === 'gagné' ? 'green.50' : 'red.50'}>
            <Flex justify="space-between" align="center" wrap="wrap">
              <Text fontWeight="bold">{new Date(game.date).toLocaleString()}</Text>
              <Badge colorScheme={game.result === 'gagné' ? 'green' : 'red'} fontSize="md">{game.result}</Badge>
            </Flex>
            <Text mt={2}>Nombre généré : <b>{game.generatedNumber}</b></Text>
            <Text>Variation : <b color={game.balanceChange > 0 ? 'green.500' : 'red.500'}>{game.balanceChange > 0 ? '+' : ''}{game.balanceChange}</b> pts</Text>
            <Text>Solde après partie : <b>{game.newBalance}</b></Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
} 