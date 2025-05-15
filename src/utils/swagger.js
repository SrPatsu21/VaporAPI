const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'VAPOR API',
            version: '1.0.0',
            description: 'Automatically generated documentation with Swagger JSDoc',
        },
        tags: [
            {
                name: 'Auth'
            },
                {
                name: 'User'
            },
                {
                name: 'Product'
            },
            {
                name: 'Title'
            },
            {
                name: 'Category'
            },
            {
                name: 'Tag'
            },
            {
                name: 'Review'
            },
            {
                name: 'Suggestion'
            },
            {
                name: 'Image',
                description: 'AVOID USING THIS ENDPOINT!',
            },
            {
                name: 'debug',
                description: 'REMOVE THIS ENDPOINT!',
            }
        ],
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