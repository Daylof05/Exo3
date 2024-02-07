import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

type UserType = {
  id: number;
  name: string;
  email: string;
};

const postData = async (data: { name: string; email: string }): Promise<UserType> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Something went wrong');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const AddUser: React.FC<{ onUserAdded: (user: UserType) => void }> = ({ onUserAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!name || !email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const userData = { name, email };
      const result = await postData(userData);
      onUserAdded(result);
      Alert.alert('Succès', 'Utilisateur ajouté avec succès.');
      setName('');
      setEmail('');
    } catch (error) {
      Alert.alert('Erreur', 'Problème lors de l\'ajout de l\'utilisateur.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder='Name'
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title="Ajouter un utilisateur"
        onPress={handleSubmit}
      />
    </View>
  );
};

export default AddUser;
