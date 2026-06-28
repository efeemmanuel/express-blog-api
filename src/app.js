require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.js');
const postRoutes = require('./routes/post.js');
const commentRoutes = require('./routes/comment.js');
const profileRoutes = require('./routes/profile.js');
const adminRoutes = require('./routes/admin.js');
const uploadRouter = require("./routes/upload.js");
const categoryRouter = require("./routes/category.js");

const cors = require('cors')


//swagger
const swaggerUi = require('swagger-ui-express');
const setupSwagger = require('./swagger');



const app = express();


// CORS
app.use(cors({
  origin: 'https://insidebox-pied.vercel.app',
  credentials: true
}));

app.use(express.json());



// Setup Swagger before routes
setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/upload", uploadRouter);
app.use("/api/category", categoryRouter);



app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error';
  res.status(status).json({ message });
});



const PORT = process.env.PORT ?? 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Express Blog API running on port ${PORT}`));
});

module.exports = app;