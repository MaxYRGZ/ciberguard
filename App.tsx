import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/screens/Home';
import { RootStackParamList } from './app/persistance/types';  
import Password from './app/screens/Password';
import NewPass from './app/screens/NewPass';
import Log from './app/screens/Log';
import Log2 from './app/screens/Log2';
import Help from './app/screens/Help';
import Tips from './app/screens/Tips';
import Mesage from './app/screens/Mesage';
import LocalDB from './app/persistance/localdb';
import Answer from './app/screens/Answer';

const Stack = createStackNavigator<RootStackParamList>();

const App = (): React.JSX.Element => {
  useEffect(() => {
    const initializeDatabase = async () => {
      await LocalDB.init();
    };

    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Log">
        <Stack.Screen name="Log" component={Log} options={{ headerShown:false }} />
        <Stack.Screen name="Log2" component={Log2} options={{ headerShown:false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown:false }} />
        <Stack.Screen name="Password" component={Password} options={{ title: 'Contraseñas' }} />
        <Stack.Screen name="NewPass" component={NewPass} options={{ title: 'Generador de claves' }} />
        <Stack.Screen name="Tips" component={Tips} options={{ title: 'Consejos de seguridad' }} />
        <Stack.Screen name="Help" component={Help} options={{ title: 'Ayuda' }} />
        <Stack.Screen name="Mesage" component={Mesage} options={{ title: 'Notificaciones' }} />
        <Stack.Screen name="Answer" component={Answer} options={{ headerShown:false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
