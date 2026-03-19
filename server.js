const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'GlamSpirit_Secret_2026';

// Middleware
// Se recomienda mantener cors() abierto durante desarrollo para evitar bloqueos del emulador
app.use(cors());
app.use(express.json());

// Usuario de prueba
const users = [{ id: 1, name: 'Luis Felipe', email: 'admin@glam.com', password: 'glammakeup@1' }];

// Ruta Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[${new Date().toLocaleTimeString()}] 📩 Petición de login para: ${email}`);
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
      );
      console.log("✅ Login exitoso - Token generado");
      return res.json({ token });
    }
    
    console.log("❌ Credenciales incorrectas");
    res.status(401).json({ message: 'Usuario o clave incorrectos' });
  } catch (error) {
    console.error("🔥 Error en el servidor:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta Perfil (Protegida por el Interceptor en el Frontend)
app.get('/api/user/profile', (req, res) => {
  console.log(`[${new Date().toLocaleTimeString()}] 👤 Petición de perfil recibida`);
  res.json({ 
    id: 1, 
    name: 'Luis Felipe', 
    email: 'admin@glam.com', 
    role: 'Premium' 
  });
});

// --- EL CAMBIO PRINCIPAL ESTÁ AQUÍ ---
// Escuchamos en '0.0.0.0' para permitir tráfico de red externa y emuladores
app.listen(PORT, '0.0.0.0', () => {
  console.log('-------------------------------------------');
  console.log(`🚀 SERVIDOR GLAM SPIRIT - MODO MULTI-ACCESO`);
  console.log(`🏠 Local:      http://localhost:${PORT}`);
  console.log(`📱 Emulador:   http://10.0.2.2:${PORT}`);
  console.log(`🌐 Red Local:  http://192.168.1.17:${PORT}`);
  console.log('-------------------------------------------');
  console.log('Esperando peticiones...');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ ERROR: El puerto ${PORT} ya está siendo usado por otra aplicación.`);
  } else {  
    console.error('❌ Error al iniciar el servidor:', err);
  }
});