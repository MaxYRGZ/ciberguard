import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import LocalDB from '../persistance/localdb';

function NewPass(): React.JSX.Element {
  const [password, setPassword] = useState('');
  const [minLength, setMinLength] = useState('8');
  const [maxLength, setMaxLength] = useState('16');
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordName, setPasswordName] = useState('');

  const generatePassword = () => {
    const length = getRandomInt(parseInt(minLength), parseInt(maxLength));
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecial) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      Alert.alert('Error', 'Debes seleccionar al menos un tipo de carácter.');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  const savePassword = async () => {
    setModalVisible(true);
  };

  const handleSavePassword = async () => {
    try {
      const db = await LocalDB.connect();
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO contrasenas (nombre, contraseña) VALUES (?, ?)',
          [passwordName, password],
          () => {
            Alert.alert(`Tu clave "${passwordName}" se guardó de manera exitosa.`);
            setModalVisible(false);
            setPasswordName('');
          },
          (error) => {
            console.error('Error saving password:', error);
            Alert.alert('Error', 'Hubo un error guardando la contraseña.');
          }
        );
      });
    } catch (error) {
      console.error('Error connecting to database:', error);
      Alert.alert('Error', 'Hubo un error conectando con la base de datos.');
    }
  };

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nueva contraseña</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword} // Esto permite la edición manual de la contraseña
          placeholderTextColor="rgb(134, 152, 185)"
          placeholder="Generated Password"
        />
        <TouchableOpacity style={styles.button} onPress={savePassword}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lengthContainer2}>
        <Text style={styles.text2}>Min</Text>
        <Text style={styles.text2}>Max</Text>
      </View>
      <View style={styles.lengthContainer}>
        <TextInput
          style={styles.lengthInput}
          value={minLength}
          onChangeText={setMinLength}
          keyboardType="numeric"
          placeholderTextColor="rgb(134, 152, 185)"
          placeholder="Num Min"
        />
        <TextInput
          style={styles.lengthInput}
          value={maxLength}
          onChangeText={setMaxLength}
          keyboardType="numeric"
          placeholderTextColor="rgb(134, 152, 185)"
          placeholder="Num Max"
        />
      </View>

      {/* Botones para seleccionar qué caracteres incluir */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, includeLowercase ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIncludeLowercase(!includeLowercase)}
        >
          <Text style={styles.toggleButtonText}>Minúsculas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, includeUppercase ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIncludeUppercase(!includeUppercase)}
        >
          <Text style={styles.toggleButtonText}>Mayúsculas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, includeNumbers ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIncludeNumbers(!includeNumbers)}
        >
          <Text style={styles.toggleButtonText}>Números</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, includeSpecial ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIncludeSpecial(!includeSpecial)}
        >
          <Text style={styles.toggleButtonText}>Especiales</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button2} onPress={generatePassword}>
        <Text style={styles.buttonText}>Generar clave</Text>
      </TouchableOpacity>

      {/* Modal para guardar la contraseña */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nombre para la clave</Text>
            <TextInput
              style={styles.modalInput}
              value={passwordName}
              placeholderTextColor="rgb(134, 152, 185)"
              onChangeText={setPasswordName}
              placeholder="Nombre de la contraseña"
            />
            <View style={styles.Buttoncont}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSavePassword}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgb(46, 79, 145)',
  },
  text2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'rgb(46, 79, 145)',
  },
  lengthContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 2,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    borderWidth: 3,
    borderColor: 'rgb(134, 152, 185)',
    borderRadius: 5,
    marginRight: 10,
    textAlign: 'center',
    color: 'rgb(134, 152, 185)',
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  lengthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  lengthInput: {
    width: '45%',
    padding: 10,
    borderWidth: 3,
    borderColor: 'rgb(134, 152, 185)',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    color: 'rgb(134, 152, 185)',
  },
  button: {
    backgroundColor: 'rgb(46, 79, 145)',
    padding: 10,
    borderRadius: 5,
    height: '35%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  button2: {
    backgroundColor: 'rgb(46, 79, 145)',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    margin: 3,
    height: '7%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: 'rgb(134, 152, 185)',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  activeButton: {
    backgroundColor: 'rgb(46, 79, 145)',
  },
  inactiveButton: {
    backgroundColor: 'rgb(134, 152, 185)',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',

  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 5,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: 'rgb(46, 79, 145)',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'rgb(134, 152, 185)',
  },
  Buttoncont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default NewPass;
