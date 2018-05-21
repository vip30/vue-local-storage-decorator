import Vue from 'vue'
export declare interface VueLocalStorageDecoratorConstructor extends Vue{
  getPersistData<T>(key: string): T | null
  persistData(dataKey: string): void
  persistDataWithProvidedKey(key: string, dataKey: string): void
  $_getPersistStateData(): {
    [key: string]: string[]
  }
  $_savePersistStateData(value: string): void
  $_saveComponentNameMapping(dataKey: string): void      
}
