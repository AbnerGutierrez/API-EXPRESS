const express = require("express");
const mysql2 = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use(bodyParser.json());

const PUERTO = 3000;

const conexion = mysql2.createConnection({
  host: "",
  database: "",
  user: "",
  password: "",
});

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});

conexion.connect((error) => {
  if (error) throw error;
  console.log("Conexion exitosa a la base de datos");
});

app.get("/", (req, res) => {
  res.send("API");
});

//READ
app.get("/pacientes", (req, res) => {
  const query = "SELECT * FROM pacientes";
  conexion.query(query, (error, resultado) => {
    if (error) {
      console.log(error.message);
      res.status(500).json({ error: "Error en la base de datos" });
      return;
    }

    if (resultado.length >= 1) {
      res.json(resultado);
    } else {
      res.json(false);
    }
  });
});
//CREATE
app.post("/pacientes/agregar", (req, res) => {
  const paciente = {
    nombre_1: req.body.nombre_1,
    nombre_2: req.body.nombre_2,
    apellidoM: req.body.apellidoM,
    apellidoP: req.body.apellidoP,
    F_nacimiento: req.body.F_nacimiento,
    F_inicio_H: req.body.F_inicio_H,
    alergias: req.body.alergias,
  };

  const query = `INSERT INTO pacientes SET ?`;
  conexion.query(query, paciente, (error, resultado) => {
    if (error) return console.log(error.message);
    res.json("Inserccion exitosa");
  });
});
//READ ONE
app.get("/pacientes/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM pacientes WHERE id_paciente=${id}`;
  conexion.query(query, (error, resultado) => {
    if (error) return console.log(error.message);

    if (resultado != 0) {
      res.json(resultado);
    } else {
      res.json("No hay paciente con ese id");
    }
  });
});
//CITAS DEL PACIENTE
app.get("/pacientes/citas/:id", (req, res) => {
  const { id } = req.params;
  const query = `Select pacientes.nombre_1,resetas.*
 from pacientes
 INNER JOIN resetas
 ON pacientes.id_paciente = resetas.id_paciente
 where pacientes.id_paciente = ${id};`;
  conexion.query(query, (error, resultado) => {
    if (error) return console.log(error.message);

    if (resultado != 0) {
      res.json(resultado);
    } else {
      res.json(false);
    }
  });
});
//UPDATE
app.put("/pacientes/actualizar/:id", (req, res) => {
  const { id } = req.params;
  const {
    nombre_1,
    nombre_2,
    apellidoM,
    apellidoP,
    F_nacimiento,
    F_inicio_H,
    alergias,
  } = req.body;
  const query = `UPDATE
                    pacientes 
                         SET 
                nombre_1='${nombre_1}',
                nombre_2='${nombre_2}',
                apellidoM='${apellidoM}',
                apellidoP='${apellidoP}',
                F_nacimiento='${F_nacimiento}',
                F_inicio_H='${F_inicio_H}',
                alergias='${alergias}'
                WHERE id_paciente='${id}'
                `;
  conexion.query(query, (error, resultado) => {
    if (error) return console.log(error.message);
    res.json("Paciente actualizado correctamente");
  });
});
//DELETE
app.delete("/pacientes/borrar/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM pacientes WHERE id_paciente='${id}'`;
  conexion.query(query, (error, resultado) => {
    if (error) return console.log(error.message);
    res.json("Paciente eliminado correctamente");
  });
});
