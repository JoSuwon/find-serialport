module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['serialport'],
      nodeModulesPath: ['./node_modules'],
    }
  }
};
