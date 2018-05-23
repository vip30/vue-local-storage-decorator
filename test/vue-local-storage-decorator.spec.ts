import { createLocalVue, shallowMount } from '@vue/test-utils'
import localStorageHelper, { Persist } from '../src/vue-local-storage-decorator'
import Component from 'vue-class-component'
import Vue, { VNode } from 'vue'
const localVue = createLocalVue()
localVue.use(localStorageHelper)

@Component({
  name: 'dummy'
})
class Dummy extends Vue {
  public dummyHello: string = 'I am dummy'
  render(h: any): VNode {
    return h('div', this.dummyHello)
  }

  public mounted() {
    //
  }
}

@Component({
  name: 'dummy-with-decorator'
})
class DummyWithDecorator extends Vue {
  @Persist()
  public dummyHello: string = 'I am dummy'
  render(h: any): VNode {
    return h('div', this.dummyHello)
  }

  public mounted() {
    //
  }
}

@Component({})
class NoNameComponent extends Vue {
  @Persist()
  public dummyHello: string = 'I am dummy'
  render(h: any): VNode {
    return h('div', this.dummyHello)
  }

  public beforeCreate() {
    this.$options.name = undefined
  }
}

class PersistStoreTest {
  public warningMessage: string = ''
  public errorMessage: string = ''
  public wrapper: any

  public testLocalStorageString: string = 'local storage'
  public testString: string = 'dummy test2'
  constructor() {
    // For retrieve the warning message
    console.warn = (message: string) => {
      this.warningMessage = message
    }
    console.error = (message: string) => {
      this.errorMessage = message
    }
  }

  public shallow() {
    this.wrapper = shallowMount(Dummy, {
      localVue
    })
  }

  public shallowDecoratedComp() {
    this.wrapper = shallowMount(DummyWithDecorator, {
      localVue
    })
  }

  public shallowNoNameComp() {
    this.wrapper = shallowMount(NoNameComponent, {
      localVue
    })
  }

  public setTestLocalStorage() {
    const stateData = {
      dummy: ['dummyHello'],
      'dummy-with-decorator': ['dummyHello']
    }
    localStorage.setItem('persistStateData', JSON.stringify(stateData))
    localStorage.setItem('dummyHello', this.testLocalStorageString)
  }

  public setDeprecatedLocalStorage() {
    const stateData = {
      dummy: ['dummyHello']
    }
    localStorage.setItem('persistStateData', JSON.stringify(stateData))
    localStorage.removeItem('dummyHello')
  }
}

describe('<vue-local-storage-decorator.spec.ts>', () => {
  test('persist data method can be set', () => {
    const t = new PersistStoreTest()
    t.shallow()
    expect(t.wrapper.vm.getPersistData).not.toBe(undefined)
    expect(t.wrapper.vm.persistData).not.toBe(undefined)
    expect(t.wrapper.vm.persistDataWithProvidedKey).not.toBe(undefined)
  })

  test('data can be persisted', () => {
    const t = new PersistStoreTest()
    t.shallow()
    t.wrapper.vm.dummyHello = t.testString
    t.wrapper.vm.persistData('dummyHello')
    expect(t.wrapper.vm.getPersistData('dummyHello')).toBe(t.testString)
  })

  test('js object can be persisted', () => {
    const t = new PersistStoreTest()
    t.shallow()
    t.wrapper.vm.dummyHello = {
      test: t.testString
    }
    t.wrapper.vm.persistData('dummyHello')
    expect(t.wrapper.vm.getPersistData('dummyHello')).toEqual({
      test: t.testString
    })
  })

  test('persist circular js object will show warning message', () => {
    const t = new PersistStoreTest()
    t.shallow()
    const dummyTestObj: any = {
      test: 'dummy'
    }
    dummyTestObj.test2 = dummyTestObj
    t.wrapper.vm.dummyHello = dummyTestObj
    t.wrapper.vm.persistData('dummyHello')
    expect(t.warningMessage).not.toBe('')
  })

  test('data can be retrieved while in created lifecycle', () => {
    const t = new PersistStoreTest()
    t.setTestLocalStorage()
    t.shallow()
    expect(t.wrapper.vm.dummyHello).toBe(t.testLocalStorageString)
  })

  test('deprecated data will be ignored while in created lifecycle', () => {
    const t = new PersistStoreTest()
    t.setDeprecatedLocalStorage()
    t.shallow()
    expect(t.wrapper.vm.dummyHello).not.toBe(t.testLocalStorageString)
  })

  test('data can be retrieved in a decorated component while in created lifecycle', () => {
    const t = new PersistStoreTest()
    t.setTestLocalStorage()
    t.shallowDecoratedComp()
    expect(t.wrapper.vm.dummyHello).toBe(t.testLocalStorageString)
  })

  test('data can be presisted in a decorated component while data is changed', () => {
    const t = new PersistStoreTest()
    t.setTestLocalStorage()
    t.shallowDecoratedComp()
    t.wrapper.vm.dummyHello = t.testString
    expect(localStorage.getItem('dummyHello')).toBe(t.testString)
    // expect(t.wrapper.vm.dummyHello)
  })


  test('component without name will be ignored and will log the error', () => {
    const t = new PersistStoreTest()
    t.setTestLocalStorage()
    t.shallowNoNameComp()
    const testStr = 'data changed'
    expect(t.wrapper.vm.dummyHello).not.toBe(t.testLocalStorageString)
    t.wrapper.vm.dummyHello = testStr
    expect(t.errorMessage).toContain('Nameless')
  })
})
