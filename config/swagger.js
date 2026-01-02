import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GMS - Gym Management System API',
      version: '1.0.0',
      description: 'Complete API documentation for GMS',
      contact: {
        name: 'API Support',
        email: 'support@gms.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.yourdomain.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Member: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'membership_type'],
          properties: {
            _id: {
              type: 'string',
              description: 'Member ID'
            },
            first_name: {
              type: 'string'
            },
            last_name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            phone: {
              type: 'string'
            },
            date_of_birth: {
              type: 'string'
            },
            membership_type: {
              type: 'string',
              enum: ['basic', 'premium', 'vip', 'student']
            },
            membership_start_date: {
              type: 'string',
              format: 'date'
            },
            membership_end_date: {
              type: 'string',
              format: 'date'
            },
            status: {
              type: 'string',
              enum: ['active', 'expired', 'suspended', 'cancelled']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Trainer: {
          type: 'object',
          required: ['first_name', 'last_name', 'email'],
          properties: {
            _id: {
              type: 'string'
            },
            first_name: {
              type: 'string'
            },
            last_name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            phone: {
              type: 'string'
            },
            specialization: {
              type: 'string'
            },
            certifications: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Equipment: {
          type: 'object',
          required: ['name', 'category', 'quantity'],
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            category: {
              type: 'string'
            },
            quantity: {
              type: 'integer'
            },
            condition: {
              type: 'string',
              enum: ['good', 'fair', 'poor']
            },
            status: {
              type: 'string',
              enum: ['operational', 'maintenance', 'retired']
            },
            image_path: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
