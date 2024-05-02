const  swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const options = {
  swaggerDefinition: {
    openapi: "3.1.0",
    info: {
      title: "Swing-note API",
      version: "1.0.0",
      description: "API för att hantera anteckningar",
    },
    tags: [
      {
        name: "Notes",
        description: "Anteckningar endpoints",
      },
      {
        name: "User",
        description: "Användarens endpoints",
      },
    ],
    components: {
      schemas: {
        Note: {
          type: "object",
          properties: {
            noteId: {
              type: "string",
            },
            title: {
              type: "string",
            },
            text: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            modifiedAt: {
              type: "string",
              format: "date-time",
            },
          },
          // additionalProperties: true,
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              default: false,
            },
            error: {
              type: "string",
            },
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/api/notes": {
        get: {
          summary: "Hämta alla anteckningar för användaren",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Returnerar alla anteckningar",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Note" },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Ogiltigt token",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        post: {
          summary: "Skapa en ny anteckning",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    text: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Skapades",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            400: {
              description: "Felaktig begäran",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Förbjuden eller Ogiltigt token",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Hittades inte",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            409: {
              description: "Konflikt",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Server fel",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/notes/{noteId}": {
        put: {
          summary: "Uppdatera en anteckning",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "noteId",
              required: true,
              schema: { type: "string" },
              description: "Anteckningen ID för att uppdatera",
            },
          ],
          requestBody: {
            required: true,
            description: "Det går att lägga till egenskaper",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    text: { type: "string" },
                    // om man vill, man får lägga till egenskaper
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Uppdaterad",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            400: {
              description: "Felaktig begäran, inga ändringar",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Förbjuden eller Ogiltigt token",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Hittades inte",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Server fel",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        delete: {
          summary: "Radera en anteckning",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "noteId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Anteckningen ID",
            },
          ],
          responses: {
            200: {
              description: "Godkänd",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Förbjuden eller Ogiltigt token",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Hittades inte",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Server fel",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/notes/search": {
        get: {
          summary: "Söka bland anteckningar",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "query",
              name: "title",
              required: true,
              schema: { type: "string" },
              description: "Sökning sker på titel",
            },
          ],
          responses: {
            200: {
              description: "Godkänd",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Note" },
                  },
                },
              },
            },
            400: {
              description: "Felaktig begäran",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Förbjuden eller Ogiltigt token",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Hittades inte",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Server fel",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/user/signup": {
        post: {
          summary: "Registrera en ny användare",
          tags: ["User"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                    email: { type: "string", format: "email" },
                  },
                  required: ["username", "password", "email"],
                },
              },
            },
          },

          responses: {
            201: {
              description: "Användaren registrerades",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/SuccessResponse" },
                },
              },
            },
            400: {
              description: "Felaktig begäran eller saknas data i body",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
                description: "Server fel",
                content: {
                  "application/json": {
                    type: "object",
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                  },
                },
              },
          },
        },
      },
      "/api/user/login": {
        post: {
          summary: "Logga in",
          tags: ["User"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                  },
                  required: ["username", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description:
                "Inloggning lyckades, genererar JWT token kopplat till den användaren som är giltlig i 30 minuter",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Ogiltiga inloggningsuppgifter",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Användaren hittades inte",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Fel vid inloggning",
              content: {
                "application/json": {
                  type: "object",
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};
    

const specifications = swaggerJsdoc(options);

module.exports = { specifications, swaggerUi };