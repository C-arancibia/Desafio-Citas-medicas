import express from "express";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import _ from "lodash";
import chalk from "chalk";

moment.locale("es");
const app = express();
const PORT = 3000;

// Función para formatear usuarios
function formatUsers(users) {
return users.map((user) => {
    return `<li>Nombre: ${user.nombre} - Apellido: ${user.apellido} - ID: ${user.id} - Timestamp: ${user.timestamp}</li>`;
}).join('\n');
}

// Función para imprimir usuarios en la consola usando Chalk
function printUsers(users, gender) {
console.log(chalk.bgWhite.blue(`${gender}\n${formatUsers(users)}`));
}

// Ruta principal
const usuarios = [];
app.get("/", async (req, res) => {
try {
    const response = await axios.get("https://randomuser.me/api");
    const datos = response.data.results;
    const usuario = {
    nombre: datos[0].name.first,
    apellido: datos[0].name.last,
    genero: datos[0].gender,
    id: uuidv4().slice(0, 8),
    timestamp: moment().format("LLLL"),
    };
    usuarios.push(usuario);

    // Separar los usuarios por género
    const usuariosH = _.filter(usuarios, { genero: "male" });
    const usuariosM = _.filter(usuarios, { genero: "female" });

    // Formatear usuarios
    const listaUsuariosH = formatUsers(usuariosH);
    const listaUsuariosM = formatUsers(usuariosM);

    // Imprimir las listas en consola
    printUsers(usuariosH, 'Hombres');
    printUsers(usuariosM, 'Mujeres');

    // Responder con HTML
    res.send(`
    <h5>Hombres</h5>
    <ul>${listaUsuariosH}</ul>
    <h5>Mujeres</h5>
    <ul>${listaUsuariosM}</ul>
    `);
} catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
}
});

// Iniciar servidor
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
