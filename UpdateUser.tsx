import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

type UserType = {
    id: number;
    name: string;
    email: string;
};

const updateData = async (userId: number, userData: { name?: string; email?: string }): Promise<UserType> => {
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

// Ajout de userId dans les props pour identifier quel utilisateur mettre à jour
const UpdateUser: React.FC<{ userId: number; onUserUpdated: (user: UserType) => void }> = ({ userId, onUserUpdated }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        if (!name || !email) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        try {
            const userData = { name, email };
            const result = await updateData(userId, userData); // Passer l'userId à updateData
            onUserUpdated(result); // Modifier onUserAdded par onUserUpdated pour plus de clarté
            Alert.alert('Succès', 'Utilisateur modifié avec succès.');
            setName('');
            setEmail('');
        } catch (error) {
            Alert.alert('Erreur', 'Problème lors de la mise à jour de l\'utilisateur.');
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
                title="Mettre à jour un utilisateur"
                onPress={handleSubmit}
            />
        </View>
    );
};

export default UpdateUser;
