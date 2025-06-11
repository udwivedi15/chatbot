const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chatbot-widget.bundle.js',
    library: 'ChatWidgetModule',
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  // ✅ React and ReactDOM are now bundled inside the final output.
  // ❌ Don't use externals if you want a standalone widget.
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },

  devServer: {
    static: path.join(__dirname, 'public'),
    host: 'localhost',
    port: 3000,
    hot: true,
    open: true,
  },
};
