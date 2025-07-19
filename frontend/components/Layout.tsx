// Composant Layout : structure globale de l'application (header, navigation, contenu)
import { ReactNode } from 'react';
import NextLink from 'next/link';
import { Box, Flex, HStack, Link, Button, Spacer, useBreakpointValue, Text, Stack, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: ReactNode }) {
  // Gestion de l'utilisateur connecté et de la déconnexion
  const { user, logout } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  // Déconnexion utilisateur
  const handleLogout = () => {
    logout();
    router.push('/');
    router.replace(router.asPath); // Force le re-render du Layout
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header et barre de navigation principale */}
      <Flex as="header" bg="white" boxShadow="sm" px={4} py={2} align="center" position="sticky" top={0} zIndex={10}>
        <NextLink href="/" passHref legacyBehavior>
          <Link fontWeight="bold" fontSize="xl" color="teal.500">TrueNumber</Link>
        </NextLink>
        <Spacer />
        {/* Menu utilisateur et navigation */}
        <Stack direction={isMobile ? 'column' : 'row'} gap={4} align="center">
          {user ? (
            <>
              {/* Affichage du nom et rôle de l'utilisateur connecté */}
              {!isMobile && (
                <Text fontWeight="medium" color="gray.600">{user.username} <Text as="span" color="teal.400">({user.role})</Text></Text>
              )}
              {/* Liens vers les pages principales */}
              <NextLink href="/game" passHref legacyBehavior><Button as={Link} colorScheme="teal" variant="ghost">Jeu</Button></NextLink>
              <NextLink href="/history" passHref legacyBehavior><Button as={Link} colorScheme="teal" variant="ghost">Historique</Button></NextLink>
              {/* Bouton Déconnexion visible sur mobile ET desktop */}
              {isMobile ? (
                <Button colorScheme="red" variant="solid" onClick={handleLogout}>Déconnexion</Button>
              ) : (
                <Menu>
                  <MenuButton as={Button} colorScheme="gray" variant="outline">
                    <Avatar size="xs" name={user.username} mr={2} />
                    {user.username}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handleLogout} color="red.500">Déconnexion</MenuItem>
                  </MenuList>
                </Menu>
              )}
            </>
          ) : (
            <>
              {/* Boutons de connexion/inscription */}
              <NextLink href="/login" passHref legacyBehavior><Button as={Link} colorScheme="teal" variant="outline">Connexion</Button></NextLink>
              <NextLink href="/register" passHref legacyBehavior><Button as={Link} colorScheme="teal">Inscription</Button></NextLink>
            </>
          )}
          {/* Bouton Admin visible uniquement pour les admins */}
          {user && user.role === 'admin' && (
            <NextLink href="/admin" passHref legacyBehavior><Button as={Link} colorScheme="orange" variant="ghost">Admin</Button></NextLink>
          )}
        </Stack>
      </Flex>
      {/* Contenu principal de la page */}
      <Box as="main" maxW="container.lg" mx="auto" py={8} px={2} w="100%">{children}</Box>
    </Box>
  );
} 