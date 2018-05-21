declare module 'vue-local-storage-decorator' {
  import Vue from 'vue'
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
       * It will persist by {component name: requested data}
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
      /**
       * Private function
       */
      $_getPersistStateData(): {
        [key: string]: string[]
      }
      /**
       * Private function
       */      
      $_savePersistStateData(value: string): void
      /**
       * Private function
       */      
      $_saveComponentNameMapping(dataKey: string): void      
    }
  }
}