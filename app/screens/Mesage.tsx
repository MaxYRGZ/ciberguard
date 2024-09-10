import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';

interface PreguntaRespuesta {
  id: number;
  pregunta: string;
  respuesta: string | null;
}

const Mesage: React.FC = () => {
  const [preguntasRespuestas, setPreguntasRespuestas] = useState<PreguntaRespuesta[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = SQLite.openDatabase({ name: 'ciberguard' }, () => {
      console.log('Database opened');
    }, (error) => {
      console.error('Error opening database:', error);
    });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM preguntas_respuestas', [], (tx, results) => {
        const rows = results.rows;
        let preguntasRespuestasList: PreguntaRespuesta[] = [];
        for (let i = 0; i < rows.length; i++) {
          preguntasRespuestasList.push(rows.item(i));
        }
        console.log('Preguntas y respuestas fetched:', preguntasRespuestasList);
        setPreguntasRespuestas(preguntasRespuestasList);
      }, (error) => {
        console.error('Error executing SELECT query:', error);
      });
    });
  }, []);

  const handleDelete = (id: number) => {
    const db = SQLite.openDatabase({ name: 'ciberguard' }, () => {
      console.log('Database opened');
    }, (error) => {
      console.error('Error opening database:', error);
    });

    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM preguntas_respuestas WHERE id = ?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert('Success', 'Pregunta eliminada.');
            setPreguntasRespuestas((prev) => prev.filter((item) => item.id !== id));
          } else {
            Alert.alert('Error', 'Hubo un problema al eliminar la pregunta.');
          }
        },
        (error) => {
          console.error('Error executing DELETE query:', error);
          Alert.alert('Error', 'Hubo un problema al eliminar la pregunta.');
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {preguntasRespuestas.length > 0 ? (
          preguntasRespuestas.map((item) => (
            <View key={item.id} style={styles.preguntaContainer}>
              <View style={styles.preguntaContent}>
                <Text style={styles.preguntaText}>Pregunta: {item.pregunta}</Text>
                {item.respuesta ? (
                  <Text style={styles.respuestaText}>Respuesta: {item.respuesta}</Text>
                ) : (
                  <Text style={styles.respuestaText}>Respuesta: No hay respuesta aún</Text>
                )}
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noPreguntasText}>No has hecho ninguna pregunta</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preguntaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(46, 79, 145)',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },
  preguntaContent: {
    flex: 1,
  },
  preguntaText: {
    fontSize: 20,
    color: 'white',
  },
  respuestaText: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
  noPreguntasText: {
    fontSize: 20,
    color: 'rgb(46, 79, 145)',
    textAlign: 'center',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  deleteButtonText: {
    color: 'rgb(46, 79, 145)',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Mesage;

