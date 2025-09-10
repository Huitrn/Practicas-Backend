// Validación de fuerza de contraseña
module.exports.isStrongPassword = function (password) {
	// Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}:;<>.,?]).{8,}$/.test(password);
}
