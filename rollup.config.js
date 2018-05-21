export default {
  input: 'dist/vue-local-storage-decorator.js',
  name: 'VueLocalStorageDecorator',
  output: {
    file: 'dist/vue-local-storage-decorator.umd.js',
    format: 'umd'
  },
  external: [
    'vue', 'vue-class-component'
  ],
  exports: 'named',
  name: 'vue-local-storage-decorator',
  globals: {
    'vue': 'Vue',
    'vue-class-component': 'VueClassComponent'
  }
}
