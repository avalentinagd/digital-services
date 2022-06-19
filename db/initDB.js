const getConnection = require('./getConnection');

async function main() {
    let connection;

    try {
        connection = await getConnection();

        console.log('Borrando tablas...');

        await connection.query('DROP TABLE IF EXISTS comments');
        await connection.query('DROP TABLE IF EXISTS services');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        await connection.query(`
            CREATE TABLE users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                biography VARCHAR(300) NOT NULL,
                photo VARCHAR(100),
                password VARCHAR(100) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE services (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(150) NOT NULL,
                description VARCHAR(500) NOT NULL,
                file VARCHAR(50),
                statusService ENUM("pending", "resolved") DEFAULT "pending",
                idUser INTEGER NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
                `);

        await connection.query(`
                CREATE TABLE servicesAttended (
                id INT PRIMARY KEY AUTO_INCREMENT,
                idUser INTEGER NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                idService INTEGER NOT NULL,
                FOREIGN KEY (idService) REFERENCES services(id),
                text VARCHAR(500) NOT NULL,
                fileCompleted VARCHAR(50),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Tablas creadas');
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

main();
