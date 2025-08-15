
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para las páginas principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get(['/justificaciones', '/justificaciones.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'justificaciones.html'));
});

app.get(['/mis-resultados', '/mis-resultados.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'mis-resultados.html'));
});

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

// Endpoint para guardar datos demográficos

// Endpoint para guardar datos demográficos
app.post('/api/demographics', async (req, res) => {
  const { user_id, age, gender, location } = req.body;
  try {
    await pool.query(
      'INSERT INTO demographics (user_id, age, gender, location) VALUES ($1, $2, $3, $4)',
      [user_id, age, gender, location]
    );
    res.status(201).json({ message: 'Datos demográficos guardados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para guardar respuestas
app.post('/api/answers', async (req, res) => {
  const { user_id, question_id, answer } = req.body;
  try {
    await pool.query(
      'INSERT INTO answers (user_id, question_id, answer) VALUES ($1, $2, $3)',
      [user_id, question_id, answer]
    );
    res.status(201).json({ message: 'Respuesta guardada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nuevo endpoint para guardar todo en respuestas_encuesta
app.post('/api/respuestas_encuesta', async (req, res) => {
  const {
    user_id,
    edad,
    genero,
    departamento,
    respuestas // Array de 20 respuestas
  } = req.body;
  if (!user_id || !edad || !genero || !departamento || !Array.isArray(respuestas) || respuestas.length !== 20) {
    return res.status(400).json({ error: 'Datos incompletos o formato incorrecto' });
  }
  try {
    const values = [
      user_id,
      edad,
      genero,
      departamento,
      ...respuestas
    ];
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO respuestas_encuesta (
      user_id, edad, genero, departamento,
      respuesta_1, respuesta_2, respuesta_3, respuesta_4, respuesta_5,
      respuesta_6, respuesta_7, respuesta_8, respuesta_9, respuesta_10,
      respuesta_11, respuesta_12, respuesta_13, respuesta_14, respuesta_15,
      respuesta_16, respuesta_17, respuesta_18, respuesta_19, respuesta_20
    ) VALUES (${placeholders})`;
    await pool.query(query, values);
    res.status(201).json({ message: 'Respuestas guardadas en una sola fila' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en puerto ${port}`);
});
