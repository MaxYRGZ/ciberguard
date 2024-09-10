import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';
import LocalDB from '../persistance/localdb'

interface Contrasena {
  id: number;
  nombre: string;
  contraseña: string;
}

const Password: React.FC = () => {
  const [contrasenas, setContrasenas] = useState<Contrasena[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = LocalDB.connect();

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM contrasenas', [], (tx, results) => {
        const rows = results.rows;
        let contrasenasList: Contrasena[] = [];
        for (let i = 0; i < rows.length; i++) {
          contrasenasList.push(rows.item(i));
        }
        console.log('Contrasenas fetched:', contrasenasList);
        setContrasenas(contrasenasList);
      }, (error) => {
        console.error('Error executing SELECT query:', error);
      });
    });
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCopy = (contraseña: string) => {
    Clipboard.setString(contraseña);
    Alert.alert('Copiado', 'La contraseña ha sido copiada al portapapeles.');
  };

  const handleDelete = (id: number) => {
    const db = LocalDB.connect();

    db.transaction((tx) => {
      tx.executeSql('DELETE FROM contrasenas WHERE id = ?', [id], (tx, results) => {
        if (results.rowsAffected > 0) {
          setContrasenas(contrasenas.filter(item => item.id !== id));
          Alert.alert('Eliminado', 'La contraseña ha sido eliminada.');
        } else {
          Alert.alert('Error', 'No se pudo eliminar la contraseña.');
        }
      }, (error: any) => {
        console.error('Error executing DELETE query:', error);
      });
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {contrasenas.length === 0 ? (
          <Text style={styles.noContrasenasText}>No tienes contraseñas guardadas</Text>
        ) : (
          contrasenas.map((item) => (
            <View key={item.id} style={styles.contrasenaContainer}>
              <Text style={styles.contrasenaText}>Nombre: {item.nombre}</Text>
              <Text style={styles.contrasenaText}>Contraseña: {item.contraseña}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleCopy(item.contraseña)}>
                  <Text style={styles.buttonText}>Copiar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
    width: '100%', 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  contrasenaContainer: {
    backgroundColor: 'rgb(46, 79, 145)',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    width: '90%',  
    alignSelf: 'stretch', 
  },
  contrasenaText: {
    fontSize: 20,
    color: 'white',
    
  },
  noContrasenasText: {
    fontWeight: "bold",
    fontSize: 24,
    color: 'rgb(46, 79, 145)',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width: '35%',
  },
  buttonText: {
    color: 'rgb(46, 79, 145)',
    fontSize: 16,
    textAlign:'center',
    fontWeight: 'bold'
  },
  Titulo: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Password;
