import { ipcRenderer } from 'electron'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CardBox from './CardBox'
import { } from './Cards.scss'
import CardInfo from './CardInfo'
import SearchBox from './SearchBox'
import dbTool from '../tools/dbTool'
import { contextmenu } from '../tools/utils'

const propTypes = {
  parent: PropTypes.string.isRequired,
}

const defaultProps = {

}

export default class Cards extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentImages: [],
      focus: true,
    }

    this._loadNumber = 6
    this._startImageNumber = 12
    this._allImagePath = dbTool.getAllImages()

    this._searchResult = this._searchResult.bind(this)
  }

  componentWillMount() {
    ipcRenderer.on('reload-images', () => {
      this._reloadImages()
    })
  }

  componentDidMount() {
    this._reloadImages()

    $(this.props.parent).scroll(_.debounce(() => {
      const $box = $(this._cardBox)
      const max = $box.outerHeight() - window.innerHeight

      if (-$box.offset().top >= max - 400) {
        this._loadMoreImgae()
      }

      if (-$box.offset().top > window.innerHeight) {
        const $scrollBox = $(this._scrollBox)
        if (!$scrollBox.hasClass('active')) $scrollBox.addClass('active')
      } else {
        $(this._scrollBox).removeClass('active')
      }
    }, 100))
  }

  open() {
    this.setState({
      focus: true,
    })

    this._allImagePath = dbTool.getAllImages()
    this.setState({
      currentImages: this._allImagePath.slice(0, this._startImageNumber),
    })
  }

  blur() {
    this.setState({
      focus: false,
    })
    this._searchBox.close()
    $(this._scrollBox).removeClass('active')
    this._cardInfo.close()
  }

  _loadMoreImgae() {
    this.setState((prevState) => {
      const maxlength = prevState.currentImages.length + this._loadNumber
      if (maxlength > this._allImagePath.length) return false

      return {
        currentImages: this._allImagePath.slice(0, maxlength),
      }
    })
  }

  _reloadImages() {
    this._allImagePath = dbTool.reloadImages()
    this.setState({
      currentImages: this._allImagePath.slice(0, this._startImageNumber),
    })
  }

  _searchResult(items) {
    this._allImagePath = items
    this.setState({
      currentImages: this._allImagePath.slice(0, this._startImageNumber),
    })
  }

  render() {
    let cardsContent = (
      <div className="default-show">
        <button
          onClick={() => ipcRenderer.emit('setting-add-image-path')}
          className="logo"
        >
          <img src="assets/logo.png" alt="" />
        </button>
        <button
          onClick={() => ipcRenderer.emit('setting-add-image-path')}
          className="add-path"
        >
          <h1>点击添加文件路径</h1>
        </button>
      </div>
    )

    if (this.state.currentImages.length > 0) {
      cardsContent = this.state.currentImages.map(value => (
        <CardBox
          src={value.path}
          key={value.id}
          contextmenu={() => {
            contextmenu()
          }}
          click={(e, path) => {
            this._cardInfo.open(path)
          }}
        />))
    }

    return (
      <div
        ref={(box) => { this._cardBox = box }}
        className="cards-box"
      >
        <SearchBox
          ref={(box) => { this._searchBox = box }}
          focus={this.state.focus}
          search={this._searchResult}
          items={dbTool.getAllImages().map(image => image.path)}
        />
        <div className="cards">
          {cardsContent}
        </div>
        <span
          ref={(box) => { this._scrollBox = box }}
          onClick={(e) => {
            $(e.currentTarget).removeClass('active')
            $(this.props.parent).animate({ scrollTop: 0 })
          }}
          role="button"
          tabIndex={-1}
          className="scroll-to-top anim-ease"
        >
          <div className="icon">
            <i className="fas fa-lg fa-angle-up" />
          </div>
        </span>
        <CardInfo ref={(cardInfo) => { this._cardInfo = cardInfo }} />
      </div>
    )
  }
}

Cards.propTypes = propTypes
Cards.defaultProps = defaultProps
