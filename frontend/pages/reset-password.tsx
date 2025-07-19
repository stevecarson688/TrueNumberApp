import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Input, Stack, Heading, Text, Alert, AlertIcon, FormControl, FormLabel } from '@chakra-ui/react';
import { resetPassword } from '../services/api';
import NextLink from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!token || typeof token !== 'string') {
      setError('Lien invalide ou expiré.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, password });
      setSuccess('Mot de passe réinitialisé avec succès. Redirection...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="100%" maxW="400px" p={8} borderRadius="lg" boxShadow="md" bg="white">
        <Heading as="h2" size="lg" color="teal.500" mb={6} textAlign="center">Réinitialiser le mot de passe</Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <FormControl isRequired>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nouveau mot de passe" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirmer le mot de passe" />
            </FormControl>
            {error && <Alert status="error"><AlertIcon />{error}</Alert>}
            {success && <Alert status="success"><AlertIcon />{success}</Alert>}
            <Button type="submit" colorScheme="teal" size="lg" w="full" isLoading={loading}>Réinitialiser</Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          <NextLink href="/login" passHref legacyBehavior>
            <Button as="a" variant="ghost" colorScheme="teal">Retour à la connexion</Button>
          </NextLink>
        </Text>
      </Box>
    </Box>
  );
} 