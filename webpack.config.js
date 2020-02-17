module.exports = (_, argv) => {
  const isProd = argv.mode === "production"

  const config = {
    mode: isProd ? "production" : "development",
    devtool: !isProd && "inline-source-map",
    entry: "./src/index.ts",
    output: {
      path: `${__dirname}/public/dist`,
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: "ts-loader"
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
    }
  }

  return config
}