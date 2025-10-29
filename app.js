require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

// Database connection
const connectDB = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Sync all models
    const syncOptions = {
      force: process.env.NODE_ENV === 'test',
      alter: process.env.NODE_ENV === 'development'
    };
    
    await sequelize.sync(syncOptions);
    // Database synchronized successfully

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Initialize database connection
connectDB().catch(err => {
  console.error('❌ Failed to initialize database:', err);
  process.exit(1);
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Swagger configuration
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RESTful API with JWT Authentication',
      version: '1.0.0',
      description: 'API documentation for the project with JWT authentication',
      contact: {
        name: 'API Support',
        url: 'https://yourwebsite.com/support',
        email: 'support@yourwebsite.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// API Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a 200 status to verify that the API is running
 *     responses:
 *       200:
 *         description: OK - API is running
 */
app.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Get student information
 *     description: Returns personal information of the student in JSend format
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                       example: "Jesús Alexander Jiménez Chávez"
 *                     cedula:
 *                       type: string
 *                       example: "31711462"
 *                     seccion:
 *                       type: string
 *                       example: "T1"
 */
app.get('/about', (req, res) => {
  res.json({
    status: "success",
    data: {
      nombreCompleto: "Jesús Alexander Jiménez Chávez",
      cedula: "31711462",
      seccion: "T1"
    }
  });
});

// API Routes
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Log the error
  console.error(err);

  // Send error response
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;