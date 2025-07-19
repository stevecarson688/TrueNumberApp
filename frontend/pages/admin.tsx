import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { Box, Heading, Stack, Button, Input, Spinner, Badge, Flex, Table, Thead, Tbody, Tr, Th, Td, Select, Alert, AlertIcon, useToast, FormControl, FormLabel } from '@chakra-ui/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  balance: number;
}

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: '', email: '', phone: '', password: '', role: 'client' });
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<Partial<User>>({});
  const [checking, setChecking] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (user === null) return; // attendre que user soit chargé
    if (!user) {
      setChecking(false);
      // router.replace('/login');
    } else if (user.role !== 'admin') {
      setChecking(false);
      // router.replace('/');
    } else {
      setChecking(false);
    }
  }, [user]);

  useEffect(() => {
    if (!checking && user && user.role === 'admin') {
      const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await fetch(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (!res.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
          const data = await res.json();
          setUsers(data);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [checking, user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      const created = await res.json();
      setUsers(users => [...users, { ...created.user, _id: created.user.id }]);
      setNewUser({ username: '', email: '', phone: '', password: '', role: 'client' });
      toast({ title: 'Utilisateur créé', status: 'success', duration: 2000, isClosable: true });
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : 'Erreur inconnue', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (u: User) => {
    setEditId(u._id);
    setEditUser({ ...u });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editUser),
      });
      if (!res.ok) throw new Error('Erreur lors de la modification');
      setUsers(users => users.map(u => u._id === id ? { ...u, ...editUser } : u));
      setEditId(null);
      setEditUser({});
      toast({ title: 'Utilisateur modifié', status: 'success', duration: 2000, isClosable: true });
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : 'Erreur inconnue', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditUser({});
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setUsers(users => users.filter(u => u._id !== id));
      toast({ title: 'Utilisateur supprimé', status: 'info', duration: 2000, isClosable: true });
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : 'Erreur inconnue', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleToggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Erreur lors du changement de rôle');
      setUsers(users => users.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast({ title: 'Rôle modifié', status: 'success', duration: 2000, isClosable: true });
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : 'Erreur inconnue', status: 'error', duration: 3000, isClosable: true });
    }
  };

  if (!user) {
    // Afficher le formulaire de connexion directement
    return (
      <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
        <Box w="100%" maxW="400px" p={8} borderRadius="lg" boxShadow="md" bg="white">
          <Heading as="h2" size="lg" color="teal.500" mb={6} textAlign="center">Connexion admin</Heading>
          <AdminLoginForm />
        </Box>
      </Box>
    );
  }
  if (user.role !== 'admin') return (
    <Box minH="70vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="100%" maxW="500px" p={8} borderRadius="lg" boxShadow="md" bg="white" textAlign="center">
        <Heading as="h2" size="lg" color="red.500" mb={4}>Accès interdit</Heading>
        <Alert status="error" borderRadius="md" mb={4} justifyContent="center">
          <AlertIcon />
          Vous n&apos;êtes pas administrateur.
        </Alert>
        <Button colorScheme="teal" variant="outline" onClick={() => router.push('/')}>Retour à l&apos;accueil</Button>
      </Box>
    </Box>
  );

  return (
    <Box maxW="900px" mx="auto" py={8}>
      {/* Bandeau de debug retiré */}
      <Heading as="h2" size="lg" color="teal.500" mb={6} textAlign="center">Administration des utilisateurs</Heading>
      <Box as="form" onSubmit={handleCreate} mb={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
        <Stack direction={{ base: 'column', md: 'row' }} gap={4} align="center">
          <Input placeholder="Nom" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required maxW="150px" />
          <Input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required maxW="200px" />
          <Input placeholder="Téléphone" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} required maxW="140px" />
          <Input placeholder="Mot de passe" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required maxW="150px" />
          <Select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} maxW="120px">
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </Select>
          <Button type="submit" colorScheme="teal" isLoading={creating}>Créer</Button>
        </Stack>
      </Box>
      {loading && <Flex justify="center" align="center" minH="100px"><Spinner size="lg" color="teal.500" /></Flex>}
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      <Box overflowX="auto">
        <Table variant="simple" size="md" bg="white" borderRadius="md" boxShadow="sm">
          <Thead bg="gray.100">
            <Tr>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Téléphone</Th>
              <Th>Rôle</Th>
              <Th>Solde</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(u => (
              <Tr key={u._id}>
                {editId === u._id ? (
                  <>
                    <Td><Input name="username" value={editUser.username || ''} onChange={handleEditChange} size="sm" /></Td>
                    <Td><Input name="email" value={editUser.email || ''} onChange={handleEditChange} size="sm" /></Td>
                    <Td><Input name="phone" value={editUser.phone || ''} onChange={handleEditChange} size="sm" /></Td>
                    <Td>
                      <Select name="role" value={editUser.role || 'client'} onChange={handleEditChange} size="sm">
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </Td>
                    <Td>{u.balance}</Td>
                    <Td>
                      <Button onClick={() => handleEditSave(u._id)} colorScheme="teal" size="sm" mr={2}>Enregistrer</Button>
                      <Button onClick={handleEditCancel} size="sm" variant="ghost">Annuler</Button>
                    </Td>
                  </>
                ) : (
                  <>
                    <Td>{u.username}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.phone}</Td>
                    <Td><Badge colorScheme={u.role === 'admin' ? 'orange' : 'teal'}>{u.role}</Badge></Td>
                    <Td>{u.balance}</Td>
                    <Td>
                      <Button onClick={() => handleEdit(u)} size="sm" colorScheme="gray" variant="outline" mr={2}>Modifier</Button>
                      <Button onClick={() => handleToggleRole(u._id, u.role)} size="sm" colorScheme={u.role === 'admin' ? 'teal' : 'orange'} variant="ghost" mr={2}>
                        {u.role === 'admin' ? 'Passer client' : 'Passer admin'}
                      </Button>
                      <Button onClick={() => handleDelete(u._id)} size="sm" colorScheme="red" variant="ghost">Supprimer</Button>
                    </Td>
                  </>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Email ou mot de passe incorrect');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      window.location.reload(); // Force le rechargement pour mettre à jour l'état utilisateur
      router.replace('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
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
        <Button type="submit" colorScheme="teal" size="lg" w="full">Se connecter</Button>
      </Stack>
    </form>
  );
} 