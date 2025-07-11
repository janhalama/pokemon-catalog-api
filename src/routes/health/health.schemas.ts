export const healthSchemas = {
  getHealth: {
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              uptime: { type: 'number' },
              environment: { type: 'string' }
            },
            required: ['status', 'timestamp', 'uptime', 'environment']
          }
        },
        required: ['success', 'data']
      },
      500: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          error: {
            type: 'object',
            properties: {
              code: { type: 'number' },
              message: { type: 'string' }
            },
            required: ['code', 'message']
          }
        },
        required: ['success', 'error']
      }
    }
  }
}; 