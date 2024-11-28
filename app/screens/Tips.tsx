import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';

interface Consejos {
  id: number;
  consejo: string;
}

const Tips: React.FC = () => {
  const [consejos, setConsejos] = useState<Consejos[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = SQLite.openDatabase({ name: 'ciberguard' }, () => {
      console.log('Database opened');
    }, (error) => {
      console.error('Error opening database:', error);
    });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM consejos', [], (tx, results) => {
        const rows = results.rows;
        let consejosList: Consejos[] = [];
        for (let i = 0; i < rows.length; i++) {
          consejosList.push(rows.item(i));
        }
        console.log('Consejos fetched:', consejosList);
        setConsejos(consejosList);
      }, (error) => {
        console.error('Error executing SELECT query:', error);
      });
    });
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {consejos.map((item) => (
        <View key={item.id} style={styles.consejoContainer}>
          <Text style={styles.consejoText}>{item.consejo}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
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
  consejoContainer: {
    backgroundColor: 'rgb(46, 79, 145)',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    width: '100%',
  },
  consejoText: {
    fontSize: 20,
    color: 'white',
  },
  Titulo: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold', 
  },
  
});

export default Tips;
