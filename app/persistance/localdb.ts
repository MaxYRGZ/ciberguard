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
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS posibles_respuestas (id INTEGER PRIMARY KEY AUTOINCREMENT, pregunta TEXT NOT NULL, respuesta TEXT)',
                [],
                () => console.log('Created table PosiblesRespuestas'),
                (error) => console.error('Error creating table PosiblesRespuestas:', error)
            );
            
            // Preguntas y respuestas sobre ciberseguridad
            const data = [
                { pregunta: '¿Qué es un virus informático?', respuesta: 'Un virus informático es un tipo de software malicioso que se propaga a través de archivos y puede dañar o alterar el funcionamiento de un sistema informático.' },
                { pregunta: '¿Cómo puedo proteger mi contraseña?', respuesta: 'Utiliza contraseñas fuertes y únicas para cada cuenta, activa la autenticación de dos factores cuando esté disponible y cambia tus contraseñas regularmente.' },
                { pregunta: '¿Qué es un firewall y por qué es importante?', respuesta: 'Un firewall es una barrera de seguridad que monitorea y controla el tráfico de red para prevenir accesos no autorizados a una red o dispositivo. Es importante para proteger contra ataques externos.' },
                { pregunta: '¿Qué es el phishing?', respuesta: 'El phishing es un tipo de ataque en el que se intenta engañar al usuario para que revele información confidencial, como contraseñas o números de tarjeta de crédito, a través de correos electrónicos o sitios web falsos.' },
                { pregunta: '¿Cómo puedo saber si mi dispositivo está infectado con malware?', respuesta: 'Busca signos como un rendimiento lento, anuncios inesperados o comportamiento extraño. Utiliza un software antivirus para escanear y eliminar posibles amenazas.' },
                { pregunta: '¿Qué es la autenticación de dos factores?', respuesta: 'La autenticación de dos factores (2FA) es una capa adicional de seguridad que requiere dos formas de verificación antes de acceder a una cuenta, como una contraseña y un código enviado a tu teléfono.' },
                { pregunta: '¿Por qué es importante actualizar regularmente mi software?', respuesta: 'Las actualizaciones de software a menudo incluyen parches de seguridad para vulnerabilidades conocidas. Mantener el software actualizado ayuda a proteger tu sistema contra amenazas emergentes.' },
            ];
            // Insertar los datos en la tabla
            data.forEach(({ pregunta, respuesta }) => {
                tx.executeSql(
                    'INSERT INTO posibles_respuestas (pregunta, respuesta) VALUES (?, ?)',
                    [pregunta, respuesta],
                    () => console.log('Inserted data into PosiblesRespuestas'),
                    (error) => console.error('Error inserting data into PosiblesRespuestas:', error)
                );
            });

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
