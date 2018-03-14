export default {
  MAX_ATTACHMENT_SIZE: 5000000, // 5MB
  cognito: {
    USER_POOL_ID: 'us-east-2_3VEmrQ9RJ',
    APP_CLIENT_ID: '4cj5i96ge1e4uj540c2re3d6h1',
    REGION: 'us-east-2',
    IDENTITY_POOL_ID: 'us-east-2:f342ff36-6693-4dbd-8f25-c0d5e8efa0c1'
  },
  apiGateway: {
    URL: 'https://qkp1mrovp8.execute-api.us-east-2.amazonaws.com/prod',
    REGION: 'us-east-2'
  },
  s3: {
    BUCKET: 'serverless-note-uploads'
  }
};