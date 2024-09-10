import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../persistance/types';

function Answer(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const buttonOnPress = (action: string): void => {
    if (action === 'regresar') {
      navigation.navigate('Home'); 
    }
  };

  return (
    <>
      <View style={styles.container}>
      <TouchableOpacity
            style={styles.imageButton}
            onPress={() => buttonOnPress('regresar')}>
            <Image
              source={require('../../assets/regresar.png')}
              style={styles.buttonImage} 
            />
       </TouchableOpacity>
       <Image
            source={require('../../assets/Ayuda.png')}
            style={styles.imageStyle}
          />
        <Text style={styles.message}>Estamos para servirte</Text>
        <Text style={styles.message2}>
          Si no recibes respuesta en 5 días puedes contactarnos:
          {'\n'}
          {'\n'}ciberguard@gmail.com
          {'\n'}312 155 2788
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(46, 79, 145)', 
  },
  message: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  message2: {
    fontSize: 29,
    color: 'white',
    fontStyle: 'italic',
    textAlign: 'center', 
  },
  imageStyle:{
    width: 300,
    height: 300,
  },
  imageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    position: 'absolute', 
    top: 20,
    left: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  buttonImage: {
    width: 50, 
    height: 50, 
    resizeMode: 'contain', 
  },
});

export default Answer;
