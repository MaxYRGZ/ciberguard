import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../persistance/types';
import LocalDB from '../persistance/localdb'; // Asegúrate de importar tu clase de base de datos
import ReactNativeBiometrics from 'react-native-biometrics';

type LogScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Log'>;

function Log(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showFingerprint, setShowFingerprint] = useState(false);
  const navigation = useNavigation<LogScreenNavigationProp>();

  const handleLogin = async () => {
    const db = await LocalDB.connect();

    db.transaction((tx) => {
      // Consulta para verificar si el correo y contraseña coinciden
      tx.executeSql(
        'SELECT * FROM cuenta WHERE correo = ? AND contraseña = ?',
        [email, password],
        (tx, results) => {
          if (results.rows.length > 0) {
            // Si el correo y la contraseña coinciden, ingresar a la pantalla Home
            navigation.navigate('Home');
          } else {
            // Si no coinciden, mostrar un mensaje de error
            Alert.alert('Error', 'Correo o contraseña incorrectos.');
          }
        },
        (error) => {
          console.error('Error al verificar el usuario:', error);
          Alert.alert('Error', 'Hubo un problema al verificar el usuario.');
        }
      );
    });
  };

  const handleFingerprint = () => {
    setShowFingerprint(!showFingerprint);
  };

  const handleFingerprintLogin = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
  
    // Verifica si el dispositivo es compatible con biometría
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
  
    console.log('Biometric Availability:', available);
    console.log('Biometric Type:', biometryType);
  
    if (available && (biometryType === 'Biometrics' || biometryType === 'TouchID' || biometryType === 'FaceID')) {
      // Autenticación biométrica
      rnBiometrics.simplePrompt({ promptMessage: 'Confirma tu identidad con biometría' })
        .then(resultObject => {
          const { success } = resultObject;
  
          if (success) {
            // Si la autenticación es exitosa, navega a la pantalla Home
            navigation.navigate('Home');
          } else {
            Alert.alert('Error', 'Autenticación biométrica cancelada');
          }
        })
        .catch(() => {
          Alert.alert('Error', 'No se pudo autenticar con biometría');
        });
    } else {
      Alert.alert('Error', 'La autenticación biométrica no está disponible en este dispositivo');
    }
  };
  
  
  

  const handleRegister = () => {
    navigation.navigate('Log2');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ingresar tu usuario</Text>
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
        placeholder="Contraseña"
        placeholderTextColor={'rgb(46, 79, 145)'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.IniciarButtonText} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.fingerprintButton} onPress={handleFingerprintLogin}>
        <Text style={styles.fingerprintButtonText}>Ingresar con Huella</Text>
      </TouchableOpacity>
      {showFingerprint && (
        <TouchableOpacity onPress={handleFingerprintLogin}>
          <Image
            source={require('../../assets/Huella.png')}
            style={styles.fingerprintImage}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrarte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  IniciarButtonText: {
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
    marginBottom: 24,
    color: 'rgb(46, 79, 145)',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    color:'rgb(46, 79, 145)',
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
  fingerprintButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  fingerprintButtonText: {
    color: 'rgb(46, 79, 145)',
    fontSize: 16,
  },
  fingerprintImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  registerButton: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'darkgray',
    fontSize: 16,
  },
});

export default Log;