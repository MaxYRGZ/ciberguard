import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LocalDB from '../persistance/localdb';

const Help: React.FC = () => {
  const [question, setQuestion] = useState('');
  const navigation = useNavigation();
  const CHATGPT_API_KEY = '.'; // Replace with your actual API key

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Por favor, ingresa una pregunta.');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHATGPT_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {"role": "system", "content": "Eres un asistente útil que proporciona consejos de seguridad."},
            {"role": "user", "content": question}
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Save the response to the database
      const db = await LocalDB.connect();
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO chatgpt_responses (question, response) VALUES (?, ?)',
          [question, aiResponse],
          () => {
            Alert.alert('Éxito', 'Tu pregunta ha sido respondida y guardada.');
            setQuestion('');
          },
          (error) => console.error('Error al guardar la respuesta:', error)
        );
      });

    } catch (error) {
      console.error('Error al hacer la pregunta:', error);
      Alert.alert('Error', 'Hubo un problema al obtener la respuesta. Por favor, intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../assets/regresar.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Pregunta sobre Seguridad</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Ingresa tu pregunta de seguridad aquí"
        multiline
        placeholderTextColor="rgb(134, 152, 185)"
      />
      <TouchableOpacity style={styles.button} onPress={handleAskQuestion}>
        <Text style={styles.buttonText}>Hacer Pregunta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(46, 79, 145)',
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgb(46, 79, 145)',
    color: 'rgb(134, 152, 185)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'rgb(46, 79, 145)',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Help;

