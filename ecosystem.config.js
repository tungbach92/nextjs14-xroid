module.exports = {
  name: "app",
  script: "./server.js",
  env: {
    PORT: 8080,
  },
  env_stg: {
    NODE_ENV: "stg",
  },
  env_production: {
    NODE_ENV: "production",
  }
}
