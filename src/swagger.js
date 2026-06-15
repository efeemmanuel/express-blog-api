// src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My BLOG API',
            version: '1.0.0',
            description: 'A sample API documentation',
            contact: {
                name: 'API Support',
                email: 'support@myblog.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            },
            {
                url: 'https://api.blog.com',
                description: 'Production server'
            }
        ]
    },
    // Path to the API routes files
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
    // Swagger UI page
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customSiteTitle: 'My API Documentation'
    }));

    // Serve OpenAPI spec as JSON
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

module.exports = setupSwagger;