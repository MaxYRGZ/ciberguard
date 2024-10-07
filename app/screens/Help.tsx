import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import SQLite from 'react-native-sqlite-storage';

const Help: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [virusFound, setVirusFound] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Aquí deberías poner tu API Key de VirusTotal
  const VIRUSTOTAL_API_KEY = '609f66daeef555ad0b6d886eaf9fdba8e599d67e474540730295b7c31c3c3946';

  const handleSelectFileAndAnalyze = async () => {
    try {
      // Primero seleccionamos el archivo
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setSelectedFile(file[0]); // Guarda el archivo seleccionado
      Alert.alert('Archivo seleccionado', `Has seleccionado ${file[0].name}`);

      // Iniciar el análisis del archivo seleccionado
      setIsAnalyzing(true);

      let formData = new FormData();
      formData.append('apikey', VIRUSTOTAL_API_KEY);
      formData.append('file', {
        uri: file[0].uri,
        type: file[0].type,
        name: file[0].name,
      });

      // Subir archivo para análisis a VirusTotal
      const uploadResponse = await fetch('https://www.virustotal.com/vtapi/v2/file/scan', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Error en la respuesta de la API: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      if (!uploadResult.scan_id) {
        throw new Error('Error al enviar archivo a VirusTotal');
      }

      // Obtener el reporte del análisis usando el `scan_id`
      const reportResponse = await fetch(
        `https://www.virustotal.com/vtapi/v2/file/report?apikey=${VIRUSTOTAL_API_KEY}&resource=${uploadResult.scan_id}`
      );

      if (!reportResponse.ok) {
        throw new Error(`Error en la respuesta de la API: ${reportResponse.status}`);
      }

      const reportResult = await reportResponse.json();

      let virusStatus;
      if (reportResult.positives > 0) {
        virusStatus = `Virus encontrado: ${reportResult.scans['SomeAntivirusEngine'].result}`;
        setVirusFound(virusStatus);
      } else {
        virusStatus = 'No se encontraron virus';
        setVirusFound(null);
      }

      // Guardar los resultados en la base de datos
      await guardarPreguntaRespuestaEnBD(file[0].name, virusStatus);

      Alert.alert('Análisis Completo', virusStatus);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelado', 'No seleccionaste ningún archivo.');
      } else {
        console.error('Error al seleccionar o analizar el archivo:', err);
        Alert.alert('Error', `Hubo un problema: ${err.message}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Función para guardar la pregunta (nombre del archivo) y la respuesta (resultado del análisis) en la base de datos
  const guardarPreguntaRespuestaEnBD = (pregunta: string, respuesta: string) => {
    const db = SQLite.openDatabase({ name: 'ciberguard' }, () => {
      console.log('Database opened');
    }, (error) => {
      console.error('Error opening database:', error);
    });

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS preguntas_respuestas (id INTEGER PRIMARY KEY AUTOINCREMENT, pregunta TEXT NOT NULL, respuesta TEXT)',
        [],
        () => console.log('Tabla preguntas_respuestas creada o ya existente'),
        (error) => console.error('Error creando la tabla preguntas_respuestas:', error)
      );

      tx.executeSql(
        'INSERT INTO preguntas_respuestas (pregunta, respuesta) VALUES (?, ?)',
        [pregunta, respuesta],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Pregunta y respuesta guardadas en la base de datos');
          } else {
            console.log('No se pudo guardar la pregunta y respuesta');
          }
        },
        (error) => {
          console.error('Error al insertar pregunta y respuesta en la base de datos:', error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/analisis.png')}
        style={styles.imageStyle}
      />
      <Text style={styles.text}>{'\n'}Análisis de Archivo</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSelectFileAndAnalyze}
        disabled={isAnalyzing}
      >
        <Text style={styles.buttonText}>
          {isAnalyzing ? 'Analizando...' : 'Seleccionar y Analizar Archivo'}
        </Text>
      </TouchableOpacity>

      {selectedFile && (
        <Text style={styles.fileName}>Archivo seleccionado: {selectedFile.name}</Text>
      )}
      
      {virusFound && (
        <Text style={styles.virusText}>Virus encontrado: {virusFound}</Text>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'rgb(46, 79, 145)',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgb(46, 79, 145)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fileName: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
  },
  virusText: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
  imageStyle: {
    width: 200,
    height: 200,
  },
});

export default Help;
