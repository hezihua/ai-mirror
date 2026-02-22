import { Component } from 'react'
import Taro from '@tarojs/taro'
import type { PropsWithChildren } from 'react'

import './app.less'

class App extends Component<PropsWithChildren> {

  componentDidMount() {
    Taro.cloud.init({
      env: 'dev-5gbynkjrf1808c12'
    })
  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return this.props.children
  }
}


export default App
