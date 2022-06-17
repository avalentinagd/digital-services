const fs = require('fs/promises');

const generateError = (message, status) => {
    const error = new Error(message);
    error.statusCode = status;
    return error;
};

const createPathIfNotExists = async (path) => {
    try {
        // Accedemos al directorio.
        await fs.access(path);
    } catch {
        // Si no es posible acceder al directorio en el "try" se
        // lanzaría un error. Si es así creamos el directorio.
        await fs.mkdir(path);
    }
};

module.exports = {
    generateError,
    createPathIfNotExists,
};
