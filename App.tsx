import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList } from 'react-native';

type UserType = {
  id: number;
  name: string;
  email: string;
};

const App = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchData().then(data => setUsers(data));
  }, []);

  async function fetchData(): Promise<UserType[]> {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data: UserType[] = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  

  async function postData() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      const newUser = await response.json();
      setUsers(currentUsers => [...currentUsers, newUser]);
      Alert.alert('Utilisateur créé');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      Alert.alert('Erreur', message);
    }
  }

  async function updateUser() {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/10`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      const updatedUser = await response.json();
      setUsers(currentUsers => currentUsers.map(user => user.id === 10 ? updatedUser : user));
      Alert.alert('Utilisateur mis à jour');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      Alert.alert('Erreur', message);
    }
  }

  async function deleteUser() {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/10`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setUsers(currentUsers => currentUsers.filter(user => user.id !== 10));
      Alert.alert('Utilisateur supprimé');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      Alert.alert('Erreur', message);
    }
  }

  return (
    <View>
      <TextInput placeholder="Nom" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Créer un utilisateur" onPress={postData} />
      <Button title="Mettre à jour l'utilisateur" onPress={updateUser} />
      <Button title="Supprimer l'utilisateur" onPress={deleteUser} />
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{`${item.name} (${item.email})`}</Text>
        )}
      />
    </View>
  );
};

export default App;
