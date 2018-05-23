declare module 'vue-local-storage-decorator' {
  import Vue, { PluginFunction, WatchOptions } from 'vue'
  module "vue/types/vue" {
    interface Vue {
      /**
       * Get persist data by persist key
       * @param key
       */
      getPersistData<T>(key: string): T | null
      /**
       * Do not call it when multiple same name component with multiple dataset
       *
       * The data in local storage will like that: {component name: requested data key} and {requested data key: requested data}
       *
       * It will get the data from local storage and set the data in the component while created lifecycle
       * @param {string} dataKey
       * @memberof Vue
       */
      persistData(dataKey: string): void
      /**
       * For normal persist the data by specify persist key and data key
       * It will not retrieve the data automatically in the lifecycle
       * @param key
       * @param dataKey
       */
      persistDataWithProvidedKey(key: string, dataKey: string): void
    }
  }
  export function Persist(options?: WatchOptions): (target: Vue, key: string) => void;
  export function install (): PluginFunction<any>
}
