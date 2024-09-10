import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../persistance/types';
import LocalDB from '../persistance/localdb'; 

type Log2ScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Log2'>;

function Log2(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<Log2ScreenNavigationProp>();

  const handleRegister = async () => {
    const db = await LocalDB.connect();

    db.transaction((tx) => {
      // Consultar si ya existe un correo en la base de datos
      tx.executeSql(
        'SELECT * FROM cuenta WHERE correo = ?',
        [email],
        (tx, results) => {
          if (results.rows.length > 0) {
            // Si ya existe un correo, mostrar una alerta
            Alert.alert('Error', 'El correo ya está registrado. Intente con otro.');
          } else {
            // Si no existe, insertar el nuevo registro
            tx.executeSql(
              'INSERT INTO cuenta (correo, contraseña) VALUES (?, ?)',
              [email, password],
              () => {
                Alert.alert('Éxito', 'Usuario registrado correctamente.');
                navigation.navigate('Log'); // Navegar al login después del registro
              },
              (error) => {
                console.error('Error al insertar el usuario:', error);
                Alert.alert('Error', 'No se pudo registrar el usuario.');
              }
            );
          }
        },
        (error) => {
          console.error('Error al verificar el correo:', error);
          Alert.alert('Error', 'Hubo un problema al verificar el correo.');
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Crear una cuenta</Text>
      <Image source={require('../../assets/Candado.png')} style={styles.imageStyle} />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor={'rgb(46, 79, 145)'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={'rgb(46, 79, 145)'}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.RegistrarseButtonText} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  RegistrarseButtonText: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(46, 79, 145)',
    width: 150,
    height: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(46, 79, 145)',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    color: 'rgb(46, 79, 145)',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  imageStyle: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
});

export default Log2;
