import React, { Component } from 'react'
import { ipcRenderer, remote } from 'electron'
import userSetting from 'electron-settings'
import { } from './Setting.scss'
import i18n from '../tools/i18n'

export default class Setting extends Component {
  static _saveImagePath(paths) {
    userSetting.set('paths', paths)
    ipcRenderer.emit('reload-images')
  }

  constructor(props) {
    super(props)
    this.state = {
      imagePaths: userSetting.get('paths', []),
    }

    this._addImagePath = this._addImagePath.bind(this)
  }

  componentDidMount() {
    ipcRenderer.on('setting-add-image-path', () => {
      this._addImagePath()
    })
  }

  open() {
    this.setState({
      imagePaths: userSetting.get('paths', []),
    })
  }

  _addImagePath() {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    }, (files) => {
      if (!files) return
      this.setState((prevState) => {
        const paths = [...new Set(prevState.imagePaths.concat(files))]
        Setting._saveImagePath(paths)
        return {
          imagePaths: paths,
        }
      })
    })
  }

  _removeImagePath(index) {
    if (index < 0 || index >= this.state.imagePaths.length) return

    this.setState((prevState) => {
      prevState.imagePaths.splice(index, 1)
      Setting._saveImagePath(prevState.imagePaths)
      return {
        imagePaths: prevState.imagePaths,
      }
    })
  }

  render() {
    return (
      <div className="setting">
        <h1>
          <i className="fas fa-cog" />&nbsp;{i18n.setting}
        </h1>
        <div className="line" />
        <section>
          <h2>图片路径</h2>
          <ul className="paths">
            {
              this.state.imagePaths.map((path, index) => (
                <li className="path" data-index={index} key={index}>
                  <button onClick={() => this._removeImagePath(index)}>
                    <i className="fas fa-times" />
                  </button>
                  <span>{path}</span>
                </li>
              ))
            }
            <li className="add-path">
              <button onClick={this._addImagePath}>
                添加路径
              </button>
            </li>
          </ul>
        </section>
      </div>
    )
  }
}
