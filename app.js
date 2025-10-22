var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API para el proyecto P3',
    },
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Health check endpoint
 *     description: Retorna un status 200 para verificar que la API está funcionando
 *     responses:
 *       200:
 *         description: OK - API funcionando correctamente
 */
app.get('/ping', (req, res) => {
  res.status(200).end();
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Obtener información del estudiante
 *     description: Retorna información personal del estudiante en formato JSend
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

module.exports = app;