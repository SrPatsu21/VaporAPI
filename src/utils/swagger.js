const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API da Pizzaria',
            version: '1.0.0',
            description: 'Documentação gerada automaticamente com Swagger JSDoc',
        },
        servers: [
            {
                url: 'https://localhost',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/*/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
    app.use('/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
    );
}

module.exports = swaggerDocs;