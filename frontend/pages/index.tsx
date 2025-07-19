// Page d'accueil de l'application TrueNumber
// Affiche un message de bienvenue, le nom de l'utilisateur connecté, et des boutons d'accès rapide.
import NextLink from 'next/link';
import { Box, Button, Heading, Text, Stack } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  // Récupère l'utilisateur connecté (s'il y en a un)
  const { user } = useAuth();
  return (
    <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
      <Stack gap={8} align="center" w="100%">
        {/* Message de bienvenue personnalisé */}
        <Heading as="h1" size="2xl" color="teal.500">
          Bienvenue sur TrueNumber{user ? `, ${user.username}` : ''}
        </Heading>
        {/* Slogan */}
        <Text fontSize="xl" color="gray.600">Testez vos chances et gérez votre compte !</Text>
        {/* Boutons d'accès */}
        <Stack direction={{ base: 'column', sm: 'row' }} gap={4}>
          <NextLink href="/login" passHref legacyBehavior>
            <Button as="a" colorScheme="teal" variant="solid" size="lg">Se connecter</Button>
          </NextLink>
          <NextLink href="/register" passHref legacyBehavior>
            <Button as="a" colorScheme="teal" variant="outline" size="lg">Créer un compte</Button>
          </NextLink>
        </Stack>
      </Stack>
    </Box>
  );
} 