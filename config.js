var config = {
  production: {
    serverAddress: "https://production.domain.com",
    port: 3005,
    awsConfig: {
      region: 'us-east-1',
      maxRetries: 3,
      accessKeyId: 'This Is Top Secret',
      secretAccessKey: 'This is bottom secret',
      timeout: 15000
    }
  },
  default: {
    serverAddress: "https://test.domain.com",
    port: 3000,
    awsConfig: {
      region: 'us-east-1',
      maxRetries: 3,
      accessKeyId: 'This is Top Secret Test',
      secretAccessKey: 'This is bottom Secret Test',
      timeout: 15000
    }
  }
}
exports.get = function get(env) {
  return config[env] || config.default;
}
