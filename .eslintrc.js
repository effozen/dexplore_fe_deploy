module.exports = {
  // 기타 설정...
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      alias: {
        map: [
          ['@', './src'],
          ['@assets', './src/assets'],
          ['@components', './src/components'],
          ['@lib', './src/lib'],
          ['@styles', './src/styles']
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
