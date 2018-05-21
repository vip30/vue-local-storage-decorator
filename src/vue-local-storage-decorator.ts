import Vue, { VueConstructor,WatchOptions } from "vue"
import { createDecorator } from 'vue-class-component'

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
      const self: Vue = this
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
        const data = localStorage.getItem(key)
        try {
          if (data) {
            return JSON.parse(data)
          }
        } catch (e) {
          // data is not json
        }
        return data as T | null
      },
      persistData(dataKey: string): void {
        this.$_saveComponentNameMapping(dataKey)
        this.persistDataWithProvidedKey(dataKey, dataKey)
      },
      persistDataWithProvidedKey(key: string, dataKey: string) {
        let result: string = ''
        const dataVal: any = this.$data[dataKey]
        if (typeof dataVal === 'object') {
          try {
            result = JSON.stringify(dataVal)
          } catch (e) {
            console.warn(e)
            return
          }
        } else {
          result = dataVal
        }
        localStorage.setItem(key, result)
      },
      $_getPersistStateData() {
        return (
          this.getPersistData<{
            [key: string]: string[]
          }>('persistStateData') || {}
        )
      },
      $_savePersistStateData(value: string) {
        localStorage.setItem('persistStateData', value)
      },
      $_saveComponentNameMapping(dataKey: string) {
        if (this.$options.name) {
          const presistStateData = this.$_getPersistStateData()
          if (!presistStateData[this.$options.name]) {
            presistStateData[this.$options.name] = []
          }
          if (presistStateData[this.$options.name].indexOf(dataKey) < 0) {
            presistStateData[this.$options.name].push(dataKey)
          }
          this.$_savePersistStateData(JSON.stringify(presistStateData))
        }
      }      
    }
  })
}