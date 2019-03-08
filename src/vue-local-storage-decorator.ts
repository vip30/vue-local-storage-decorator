import Vue, { VueConstructor, WatchOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import { VueLocalStorageDecoratorConstructor } from '../types/vue-local-storage-decorator-constructor'

export function Persist(
  options: WatchOptions = {
    deep: true
  }
) {
  return (target: Vue, key: string) => {
    createDecorator((componentOptions, k) => {
      const original = componentOptions.mounted
      componentOptions.mounted = function() {
        if (original) {
          original.bind(this)()
        }
        this.$watch(
          key,
          (newVal: any, oldVal: any) => {
            this.persistData(key)
          },
          options
        )
      }
    })(target, key)
  }
}

export default (localVue: VueConstructor<Vue>) => {
  return localVue.mixin({
    created() {
      const self: VueLocalStorageDecoratorConstructor = this as any
      if (!self.$options.name) {
        return
      }
      const componentDataKeys = self.$_getPersistStateData()[this.$options.name]
      if (componentDataKeys) {
        componentDataKeys.forEach(dataKey => {
          const dataVal = self.getPersistData<any>(dataKey)
          if (dataVal) {
            self.$data[dataKey] = dataVal
          }
        })
      }
    },
    methods: {
      getPersistData<T>(key: string): T | null {
        if (localStorage) {
          const data = localStorage.getItem(key)
          try {
            if (data) {
              return JSON.parse(data)
            }
          } catch (e) {
            // data is not json
          }
          return data as T | null          
        } else {
          console.warn('Browser does not support local storage ')
          return null
        }
      },
      persistData(dataKey: string): void {
        const self: VueLocalStorageDecoratorConstructor = this as any
        self.$_saveComponentNameMapping(dataKey)
        self.persistDataWithProvidedKey(dataKey, dataKey)
      },
      persistDataByKeyValue(key: string, value: any) {
        let result: string = ''
        if (typeof value === 'object') {
          try {
            result = JSON.stringify(value)
          } catch (e) {
            console.warn(e)
            return
          }
        } else {
          result = value
        }
        if (localStorage) {
          localStorage.setItem(key, result)
        } else {
          console.warn('Browser does not support local storage ')
        }
      },
      persistDataWithProvidedKey(key: string, dataKey: string) {
        const self: VueLocalStorageDecoratorConstructor = this as any
        const dataVal: any = self.$data[dataKey]
        self.persistDataByKeyValue(key, dataVal)
      },
      $_getPersistStateData() {
        const self: VueLocalStorageDecoratorConstructor = this as any
        return (
          self.getPersistData<{
            [key: string]: string[]
          }>('persistStateData') || {}
        )
      },
      $_saveComponentNameMapping(dataKey: string) {
        const self: VueLocalStorageDecoratorConstructor = this as any
        if (self.$options.name) {
          const presistStateData = self.$_getPersistStateData()
          if (!presistStateData[self.$options.name]) {
            presistStateData[self.$options.name] = []
          }
          if (presistStateData[self.$options.name].indexOf(dataKey) < 0) {
            presistStateData[self.$options.name].push(dataKey)
          }
          self.persistDataByKeyValue('persistStateData', presistStateData)
        } else {
          console.error('Nameless component cannot use persistData')
        }
      }
    }
  })
}
