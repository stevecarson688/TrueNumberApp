import { useState } from 'react';
import { Box, Button, Input, Stack, Heading, Text, Alert, AlertIcon, FormControl, FormLabel } from '@chakra-ui/react';
import NextLink from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la demande');
      setSuccess('Si cet email existe, un lien de réinitialisation a été envoyé.');
      setEmail('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="100%" maxW="400px" p={8} borderRadius="lg" boxShadow="md" bg="white">
        <Heading as="h2" size="lg" color="teal.500" mb={6} textAlign="center">Mot de passe oublié</Heading>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email" />
            </FormControl>
            {error && <Alert status="error"><AlertIcon />{error}</Alert>}
            {success && <Alert status="success"><AlertIcon />{success}</Alert>}
            <Button type="submit" colorScheme="teal" size="lg" w="full" isLoading={loading} disabled={loading}>Envoyer le lien</Button>
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