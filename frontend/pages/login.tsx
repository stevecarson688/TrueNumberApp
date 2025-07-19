// Page de connexion utilisateur
// Permet à l'utilisateur de se connecter à son compte TrueNumber
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Box, Button, Input, Stack, Heading, Text, Alert, AlertIcon, FormControl, FormLabel } from '@chakra-ui/react';
import { loginUser } from '../services/api';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  // États pour le formulaire de connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Redirige l'utilisateur déjà connecté vers la page de jeu
  useEffect(() => {
    if (user && router.pathname === '/login') {
      router.replace('/game');
    }
  }, [user, router]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      router.replace('/game'); // Utilise replace pour forcer le re-render du Layout
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Afficher le formulaire tant que user est null (non connecté)
  if (user && router.pathname === '/login') {
    return null; // ou un loader très court si tu veux
  }

  return (
    <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="100%" maxW="400px" p={8} borderRadius="lg" boxShadow="md" bg="white">
        <Heading as="h2" size="lg" color="teal.500" mb={6} textAlign="center">Connexion</Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mot de passe</FormLabel>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Votre mot de passe" />
            </FormControl>
            {error && <Alert status="error"><AlertIcon />{error}</Alert>}
            <Button type="submit" colorScheme="teal" size="lg" w="full" isLoading={loading} disabled={loading}>Se connecter</Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          Pas encore de compte ?{' '}
          <NextLink href="/register" passHref legacyBehavior>
            <Button as="a" variant="ghost" colorScheme="teal">Créer un compte</Button>
          </NextLink>
        </Text>
      </Box>
    </Box>
  );
} 