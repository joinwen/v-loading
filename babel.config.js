module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: false
      }
    ]
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true,
        helpers: true,
        corejs: 3
      }
    ]
  ]
};
