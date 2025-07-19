// Page du jeu TrueNumber
// Permet à l'utilisateur de jouer, de voir son solde et le résultat de la partie
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { Box, Button, Heading, Text, Stack, Alert, AlertIcon, useToast, Spinner, Flex } from '@chakra-ui/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Game() {
  // Gestion de l'utilisateur, du solde et des états du jeu
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [generatedNumber, setGeneratedNumber] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(user?.balance ?? null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const toast = useToast();

  // Redirige l'utilisateur non connecté vers la page de connexion
  useEffect(() => {
    if (user === null) return; // attendre que user soit chargé
    if (!user) {
      router.replace('/login');
    } else {
      setChecking(false);
    }
  }, [user, router]);

  if (checking) return <Flex minH="70vh" align="center" justify="center"><Spinner size="lg" color="teal.500" /></Flex>;

  const handlePlay = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/game/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur lors du jeu');
      }
      const data = await res.json();
      setResult(data.result);
      setGeneratedNumber(data.generatedNumber);
      setBalance(data.newBalance);
      refreshUser();
      toast({
        title: data.result === 'gagné' ? 'Bravo, vous avez gagné !' : 'Dommage, perdu !',
        description: `Nombre généré : ${data.generatedNumber}`,
        status: data.result === 'gagné' ? 'success' : 'error',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
      <Stack gap={8} align="center" w="100%">
        {/* Titre et solde */}
        <Heading as="h2" size="xl" color="teal.500">Jeu TrueNumber</Heading>
        <Text fontSize="lg">Solde actuel : <b>{balance}</b> points</Text>
        {/* Bouton pour jouer */}
        <Button onClick={handlePlay} colorScheme="teal" size="lg" isLoading={loading} loadingText="Génération...">
          Générer un nombre
        </Button>
        {/* Affichage du résultat */}
        {result && (
          <Box textAlign="center" p={4} borderRadius="md" bg={result === 'gagné' ? 'green.50' : 'red.50'} w="100%" maxW="350px">
            <Text fontSize="lg">Nombre généré : <b>{generatedNumber}</b></Text>
            <Text fontWeight="bold" color={result === 'gagné' ? 'green.500' : 'red.500'} fontSize="xl">{result}</Text>
          </Box>
        )}
        {/* Affichage des erreurs */}
        {error && <Alert status="error"><AlertIcon />{error}</Alert>}
      </Stack>
    </Box>
  );
} 