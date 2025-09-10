// Modelo de usuario para registro/login
const pool = require('../db');

module.exports = {
	async findByEmail(email) {
		const { rows } = await pool.query('SELECT * FROM "Usuario" WHERE email = $1', [email]);
		return rows[0];
	},
	async create({ email, nombre, password, role }) {
		const { rows } = await pool.query(
			'INSERT INTO "Usuario" (email, nombre, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
			[email, nombre, password, role]
		);
		return rows[0];
	}
};
