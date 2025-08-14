-- Tabla para datos demográficos
CREATE TABLE IF NOT EXISTS demographics (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  age INT,
  gender VARCHAR(50),
  location VARCHAR(100)
);

-- Tabla para respuestas
CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  question_id VARCHAR(100) NOT NULL,
  answer TEXT
);
