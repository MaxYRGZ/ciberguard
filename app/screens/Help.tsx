import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SQLite from 'react-native-sqlite-storage';
import { RootStackParamList } from '../persistance/types';
import LocalDB from '../persistance/localdb';

type HelpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Answer'>;

const Help: React.FC = () => {
  const [question, setQuestion] = useState('');
  const navigation = useNavigation<HelpScreenNavigationProp>();
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await LocalDB.connect();
      setDb(database);
      database.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS preguntas_respuestas (id INTEGER PRIMARY KEY AUTOINCREMENT, pregunta TEXT NOT NULL, respuesta TEXT)',
          [],
          () => console.log('Table preguntas_respuestas created or already exists'),
          (error) => console.error('Error creating table preguntas_respuestas:', error)
        );
      });
    };

    initializeDatabase();
  }, []);

  const handleSendQuestion = () => {
    if (question.trim() === '') {
      Alert.alert('Error', 'Por favor, escribe una pregunta.');
    } else {
      db?.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO preguntas_respuestas (pregunta) VALUES (?)',
          [question],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Pregunta guardada');
              Alert.alert('Success', 'Tu pregunta ha sido guardada.');
              setQuestion('');
              navigation.navigate('Answer');
            } else {
              Alert.alert('Error', 'Hubo un problema al guardar tu pregunta.');
            }
          },
          (error) => {
            console.error('Error executing INSERT query:', error);
            Alert.alert('Error', 'Hubo un problema al guardar tu pregunta.');
          }
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/pregunta.png')}
        style={styles.imageStyle}
      />
      <Text style={styles.text}>{'\n'}¿Cuál es tu pregunta?</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu pregunta aquí"
        value={question}
        onChangeText={setQuestion}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendQuestion}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'rgb(46, 79, 145)',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    fontSize: 18,
    borderWidth: 3,
    borderColor: 'rgb(134, 152, 185)',
    borderRadius: 5,
    textAlign: 'center',
    width: '80%',
    color: 'rgb(134, 152, 185)',
  },
  button: {
    backgroundColor: 'rgb(46, 79, 145)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
});

export default Help;
