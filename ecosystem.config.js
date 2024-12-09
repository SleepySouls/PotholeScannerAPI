module.exports = {
  apps : [{
    name: 'potholescannerapi',
    script: 'index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }
  ],

};
