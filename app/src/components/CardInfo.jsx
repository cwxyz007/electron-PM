import React, { Component } from 'react'
import path from 'path'
import { ipcRenderer } from 'electron'
import PropTypes from 'prop-types'
import ExtractImgColor from 'extract-img-color'
import { } from './CardInfo.scss'
import Tag from './Tag';
import dbTool from '../tools/dbTool'
import AddTag from './AddTag'
import CardBox from './CardBox'
import utils from '../tools/utils'

const propTypes = {
  src: PropTypes.string,
}

const defaultProps = {
  src: '',
}

export default class CardInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      src: '',
      allTags: dbTool.getAllTags(),
      colors: [],
      infos: [],
    }
    this.extractImgColor = new ExtractImgColor()

    this.close = this.close.bind(this)
    this._closeTagsPage = this._closeTagsPage.bind(this)
    this._openTagsPage = this._openTagsPage.bind(this)
  }

  componentDidMount() {
    this.open(this.props.src)
    $(window).on('keyup', (e) => {
      if (e.key === 'Escape') {
        this.close()
      }
    })
  }

  open(src) {
    if (!src) return

    this.setState({
      tags: dbTool.getTagsByImage(src),
      allTags: dbTool.getAllTags(),
      src,
    })

    $(this._cardInfoBox).addClass('active')
  }

  close() {
    $(this._cardInfoBox).removeClass('active')
    this._closeTagsPage()
  }

  _openTagsPage() {
    $(this._newTagsBox).addClass('active')
  }

  _closeTagsPage() {
    this._addTagButton.clearInput()
    $(this._newTagsBox).removeClass('active')
  }

  _updateTags() {
    this.setState({
      tags: dbTool.getTagsByImage(this.state.src),
    })

    // $(`img[src='${path}']`).trigger('update')
  }

  _addTag(value) {
    dbTool.addTag(value)
    this.setState({
      allTags: dbTool.getAllTags(),
    })
    this._addImageTag(value)
    this._closeTagsPage()
  }

  _addImageTag(value) {
    dbTool.addTagByImage(this.state.src, value)

    this._updateTags()
  }

  _deleteImageTag(value) {
    dbTool.deleteTagByImage(this.state.src, value)
    this._updateTags()
  }

  render() {
    return (
      <div
        ref={(box) => { this._cardInfoBox = box }}
        className="card-info-box anim-ease"
      >
        <h3 className="title">
          <button
            onClick={this.close}
            className="close"
          >
            <i className="fa fa-2x fa-caret-right" />
          </button>
          <span className="name">
            {path.parse(this.state.src).name.slice(0, 20)}
          </span>
          <button
            onClick={() => {
              ipcRenderer.send('open-file', { path: this.state.src })
            }}
            className="open-file"
          >
            <i className="fas fa-image" />
          </button>
          <button
            onClick={() => {
              ipcRenderer.send('open-folder', { path: this.state.src })
            }}
            className="open-file-folder"
          >
            <i className="fas fa-folder" />
          </button>
        </h3>
        <div className="picture">
          <CardBox
            width="100%"
            height="auto"
            src={this.state.src}
            imageLoaded={(image) => {
              const fileSize = utils.getFileSize(this.state.src)
              const size = `${image.naturalWidth}*${image.naturalHeight}`
              const format = this.state.src.split('.').pop().toUpperCase()

              this.setState({
                colors: this.extractImgColor.getPalette(image, 10)
                            .filter((value, index) => index % 2 === 0),
                infos: [{
                  id: 1,
                  key: '文件大小',
                  value: fileSize,
                }, {
                  id: 2,
                  key: '图片分辨率',
                  value: size,
                }, {
                  id: 3,
                  key: '图片格式',
                  value: format,
                }],
              })
            }}
          />
        </div>
        <div className="line" />
        <div className="colors">
          {
            this.state.colors.map((color, index) =>
              (<button
                className="color"
                key={index}
                style={{ backgroundColor: `rgb(${color.join()})` }}
                data-color={`rgb(${color.join()})`}
                onClick={() => {
                  utils.copyToClipboard(`rgb(${color.join()})`)
                }}
              />))
          }
        </div>
        <div className="line" />
        <div className="infos">
          {
            this.state.infos.map(info => (
              <button
                className="info"
                key={info.id}
                onClick={() => {
                  utils.copyToClipboard(info.value)
                  utils.notify('Copied!')
                }}
              >
                {info.key} : {info.value}
              </button>
            ))
          }
        </div>
        <div className="line" />
        <div className="tags">
          <div
            ref={(box) => { this._newTagsBox = box }}
            className="all-tags anim-ease"
          >
            <button
              onClick={this._closeTagsPage}
              className="close-all-tags anim-ease"
            >
              <i className="fas fa-lg fa-caret-right" />
            </button>
            {
              this.state.allTags.map(value => (
                <Tag
                  disabled
                  click={() => {
                    this._addImageTag(value.text)
                    this._closeTagsPage()
                  }}
                  key={value.id}
                >
                  {value.text}
                </Tag>
              ))
            }
            <AddTag
              ref={(e) => { this._addTagButton = e }}
              addClick={value => this._addTag(value)}
            />
          </div>
          {
            this.state.tags.map(value => (
              <Tag
                delete={() => {
                  this._deleteImageTag(value.text)
                }}
                key={value.id}
              >
                {value.text}
              </Tag>
            ))
          }
          <button
            onClick={this._openTagsPage}
            className="add-image-tag anim-ease"
          >
            <i className="fas fa-plus" />
          </button>
        </div>
      </div>
    )
  }
}

CardInfo.propTypes = propTypes
CardInfo.defaultProps = defaultProps
