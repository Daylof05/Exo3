import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TextInput, Button, Alert } from 'react-native';

type UserType = {
  id: number;
  name: string;
  email: string;
};

const fetchData = async (): Promise<UserType[]> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data: UserType[] = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const postData = async (userData: { name: string; email: string }): Promise<UserType> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Something went wrong');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateUser = async (userId: number, userData: { name: string; email: string }): Promise<UserType> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Something went wrong');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const App: React.FC = () => {
  const [data, setData] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  const handleAddOrUpdateUser = async () => {
    if (!name || !email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      if (selectedUser) {
        const updatedUser = await updateUser(selectedUser.id, { name, email });
        const newData = data.map(item => item.id === updatedUser.id ? updatedUser : item);
        setData(newData);
        Alert.alert('Succès', 'Utilisateur mis à jour avec succès.');
      } else {
        const newUser = await postData({ name, email });
        setData([...data, newUser]);
        Alert.alert('Succès', 'Utilisateur ajouté avec succès.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Problème lors de l\'ajout/mise à jour de l\'utilisateur.');
    }

    setName('');
    setEmail('');
    setSelectedUser(null);
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title={selectedUser ? "Mettre à jour l'utilisateur" : "Ajouter un utilisateur"}
        onPress={handleAddOrUpdateUser}
      />
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View>
            <Text onPress={() => { setSelectedUser(item); setName(item.name); setEmail(item.email); }}>
              {item.name} - {item.email}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default App;
