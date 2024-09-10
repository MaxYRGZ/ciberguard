import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../persistance/types';  

function Home(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [nombre, setNombre] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const buttonOnPress = (action: string): void => {
    if (action === 'Consultar Contraseña') {
      navigation.navigate('Password'); 
    } 
    if (action === 'Generar Contraseña') {
      navigation.navigate('NewPass'); 
    } 
    if (action === 'regresar') {
      navigation.navigate('Log'); 
    } 
    if (action === 'Consejos') {
      navigation.navigate('Tips'); 
    } 
    if (action === 'Ayuda') {
      navigation.navigate('Help'); 
    } 
    if (action === 'notificaciones') {
      navigation.navigate('Mesage'); 
    } 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#2e4f91"
        translucent={false}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        {/* Contenedor separado para los botones de regresar y campana */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => buttonOnPress('regresar')}>
            <Image
              source={require('../../assets/regresar.png')}
              style={styles.buttonImage} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton2}
            onPress={() => buttonOnPress('notificaciones')}>
            <Image
              source={require('../../assets/campana.png')}
              style={styles.buttonImage} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Contenedor principal con el resto del contenido */}
        <View style={styles.content}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.imageStyle}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => buttonOnPress('Generar Contraseña')}>
            <Text style={styles.buttonText}>Generar Contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => buttonOnPress('Consultar Contraseña')}>
            <Text style={styles.buttonText}>Consultar Contraseña</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => buttonOnPress('Consejos')}>
            <Text style={styles.buttonText}>Consejos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => buttonOnPress('Ayuda')}>
            <Text style={styles.buttonText}>Ayuda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(46, 79, 145)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgb(46, 79, 145)', 
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
    alignItems: 'center', 
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: 'hidden',
  },
  imageButton2: {
    width: 45,
    height: 45,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonImage: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'blue',
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
    width: '80%',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
