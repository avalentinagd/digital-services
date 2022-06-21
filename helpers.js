const fs = require('fs/promises');

const generateError = (message, status) => {
    const error = new Error(message);
    error.statusCode = status;
    return error;
};

const createPathIfNotExists = async (path) => {
    try {
        // Acceder al directorio.
        await fs.access(path);
    } catch {
        // Si no es posible acceder al directorio se
        // lanza un error y se crea el directorio.
        await fs.mkdir(path);
    }
};

module.exports = {
    generateError,
    createPathIfNotExists,
};
