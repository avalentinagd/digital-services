const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userByEmailQuery = require('../../db/userQueries/userByEmailQuery');

const { generateError } = require('../../helpers');
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw generateError(
                'There are still some fields to be filled in',
                400
            );
        }

        // Se obtiene al usuario con el email del body.
        const user = await userByEmailQuery(email);

        // Se comprueba si las contraseñas coinciden.
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw generateError('Invalid password', 401);
        }

        // Información que se va a guardar en el token.
        const payload = {
            id: user.id,
        };

        // Se crea el token.
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '15d',
        });

        res.send({
            status: 'ok',
            data: {
                token,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = loginUser;
