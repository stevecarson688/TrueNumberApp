// Page d'inscription utilisateur
// Permet à un nouvel utilisateur de créer un compte TrueNumber
import { useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Input, Stack, Heading, Text, Alert, AlertIcon, FormControl, FormLabel } from '@chakra-ui/react';
import { registerUser } from '../services/api';
import { useRouter } from 'next/router';

export default function Register() {
  // États pour le formulaire d'inscription
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await registerUser({ username, email, password, phone });
      setSuccess('Compte créé avec succès, vous allez être redirigé vers la connexion.');
      setUsername(''); setEmail(''); setPhone(''); setPassword('');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="100%" maxW="400px" p={8} borderRadius="lg" boxShadow="md" bg="white">
        <Heading as="h2" size="lg" color="teal.500" mb={6} textAlign="center">Créer un compte</Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <FormControl isRequired>
              <FormLabel>Nom d&apos;utilisateur</FormLabel>
              <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d&apos;utilisateur" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Téléphone</FormLabel>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Votre téléphone" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Mot de passe</FormLabel>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Votre mot de passe" />
            </FormControl>
            {error && <Alert status="error"><AlertIcon />{error}</Alert>}
            {success && <Alert status="success"><AlertIcon />{success}</Alert>}
            <Button type="submit" colorScheme="teal" size="lg" w="full" isLoading={loading} disabled={loading}>Créer un compte</Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          Déjà un compte ?{' '}
          <NextLink href="/login" passHref legacyBehavior>
            <Button as="a" variant="ghost" colorScheme="teal">Se connecter</Button>
          </NextLink>
        </Text>
      </Box>
    </Box>
  );
} 