const path = require('path');

module.exports = {
  mode: 'production', // or 'development' if testing
  entry: './src/index.js', // This file imports App.js and mounts it
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chatbot-widget.bundle.js',
    library: 'ChatWidgetModule',
    libraryTarget: 'umd', // So you can call ChatWidgetModule.init()
    globalObject: 'this', // Needed for UMD in browser
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Support .js and .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'], // So you can import App from './App'
  }
};
