DROP DATABASE IF EXISTS botica_roluad;
CREATE DATABASE botica_roluad CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE botica_roluad;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  rol ENUM('ADMIN','CLIENTE') NOT NULL DEFAULT 'CLIENTE',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imagen VARCHAR(500),
  categoria_id INT,
  activo TINYINT(1) DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  usuario_id INT NULL,
  nombre_cliente VARCHAR(120) NOT NULL,
  email_cliente VARCHAR(120),
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(255),
  referencia VARCHAR(255),
  tipo_entrega ENUM('DELIVERY','RECOJO') NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado ENUM('PENDIENTE','CONFIRMADO','PREPARANDO','EN_CAMINO','LISTO_RECOJO','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE pedido_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_pedidos_codigo ON pedidos(codigo);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);

-- Usuario administrador de prueba
-- Email: admin@roluad.com
-- Password: admin123
INSERT INTO usuarios (nombre, email, password, telefono, direccion, rol) VALUES
('Administrador ROLUAD', 'admin@roluad.com', 'plain:admin123', '999999999', 'Botica ROLUAD', 'ADMIN');

INSERT INTO categorias (nombre) VALUES
('Medicamentos'),
('Vitaminas y suplementos'),
('Cuidado personal'),
('Bebés'),
('Primeros auxilios'),
('Higiene');

INSERT INTO productos (nombre, descripcion, precio, stock, imagen, categoria_id) VALUES
('Paracetamol 500mg', 'Analgésico y antipirético para malestares generales.', 5.50, 120, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80', 1),
('Ibuprofeno 400mg', 'Antiinflamatorio de uso común. Consultar al químico farmacéutico.', 8.90, 80, 'https://images.unsplash.com/photo-1550572017-edd951aa8f3f?auto=format&fit=crop&w=700&q=80', 1),
('Alcohol medicinal 70%', 'Alcohol para limpieza y desinfección externa.', 6.50, 90, 'https://images.unsplash.com/photo-1583947581924-a6d748b7fd25?auto=format&fit=crop&w=700&q=80', 5),
('Vitamina C 1000mg', 'Suplemento de vitamina C para adultos.', 18.00, 60, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=700&q=80', 2),
('Shampoo anticaspa', 'Cuidado capilar para uso diario.', 16.90, 45, 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=700&q=80', 3),
('Pañales para bebé M', 'Pañales cómodos y absorbentes.', 32.90, 30, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=700&q=80', 4),
('Mascarillas quirúrgicas', 'Caja de mascarillas de protección.', 12.00, 100, 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=700&q=80', 6),
('Curitas adhesivas', 'Apósitos adhesivos para heridas pequeñas.', 4.50, 150, 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=700&q=80', 5);
