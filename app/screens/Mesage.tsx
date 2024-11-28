import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LocalDB from '../persistance/localdb';

interface ChatGPTResponse {
  id: number;
  question: string;
  response: string;
  timestamp: string;
}

const Mesage: React.FC = () => {
  const [responses, setResponses] = useState<ChatGPTResponse[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchResponses = async () => {
      const db = await LocalDB.connect();
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM chatgpt_responses ORDER BY timestamp DESC',
          [],
          (_, results) => {
            const len = results.rows.length;
            const fetchedResponses: ChatGPTResponse[] = [];
            for (let i = 0; i < len; i++) {
              fetchedResponses.push(results.rows.item(i));
            }
            setResponses(fetchedResponses);
          },
          (error) => console.error('Error al obtener respuestas:', error)
        );
      });
    };

    fetchResponses();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Eliminar Respuesta",
      "¿Estás seguro de que quieres eliminar esta respuesta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "OK", onPress: async () => {
          const db = await LocalDB.connect();
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM chatgpt_responses WHERE id = ?',
              [id],
              (_, results) => {
                if (results.rowsAffected > 0) {
                  setResponses(responses.filter(response => response.id !== id));
                  Alert.alert('Éxito', 'Respuesta eliminada exitosamente.');
                }
              },
              (error) => console.error('Error al eliminar la respuesta:', error)
            );
          });
        }}
      ]
    );
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
      <Text style={styles.title}>Respuestas de IA</Text>
      <ScrollView style={styles.scrollView}>
        {responses.map((item) => (
          <View key={item.id} style={styles.responseContainer}>
            <Text style={styles.questionText}>P: {item.question}</Text>
            <Text style={styles.responseText}>R: {item.response}</Text>
            <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleString()}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  scrollView: {
    flex: 1,
  },
  responseContainer: {
    backgroundColor: 'rgb(46, 79, 145)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  responseText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  timestampText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default Mesage;

