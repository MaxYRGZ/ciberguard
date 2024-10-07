import SQLite from 'react-native-sqlite-storage';

export default class LocalDB {
    static connect() {
        return SQLite.openDatabase({ name: 'ciberguard' });
    }

    static async init() {
        const db = await LocalDB.connect();
        
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS cuenta (id INTEGER PRIMARY KEY CHECK (id = 1), correo TEXT NOT NULL, contraseña TEXT NOT NULL)',
                [],
                () => console.log('Created table Cuenta'),
                (error) => console.error('Error creating table Cuenta:', error)
            );
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS contrasenas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, contraseña TEXT NOT NULL)',
                [],
                () => console.log('Created table Contrasenas'),
                (error) => console.error('Error creating table Contrasenas:', error)
            );
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS consejos (id INTEGER PRIMARY KEY AUTOINCREMENT, consejo TEXT NOT NULL)',
                [],
                () => console.log('Created table Consejos'),
                (error) => console.error('Error creating table Consejos:', error)
            );
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS preguntas_respuestas (id INTEGER PRIMARY KEY AUTOINCREMENT, pregunta TEXT NOT NULL, respuesta TEXT)',
                [],
                () => console.log('Created table PreguntasRespuestas'),
                (error) => console.error('Error creating table PreguntasRespuestas:', error)
            );

            // Insertar algunos consejos sobre seguridad en internet
            const consejosSeguridad = [
                'Usa contraseñas fuertes y únicas para cada cuenta.',
                'Habilita la autenticación de dos factores siempre que sea posible.',
                'No compartas información personal sensible en redes sociales.',
                'Mantén tu software actualizado para evitar vulnerabilidades.',
                'Ten cuidado con los correos electrónicos y enlaces sospechosos.',
                'Utiliza una conexión segura (HTTPS) cuando navegas en sitios web.',
                'Haz copias de seguridad periódicas de tu información importante.',
                'Evita conectarte a redes Wi-Fi públicas para realizar transacciones sensibles.'
            ];

            consejosSeguridad.forEach(consejo => {
                tx.executeSql(
                    'INSERT INTO consejos (consejo) VALUES (?)',
                    [consejo],
                    () => console.log(`Inserted consejo: ${consejo}`),
                    (error) => console.error('Error inserting consejo:', error)
                );
            });
        });
    }
}
