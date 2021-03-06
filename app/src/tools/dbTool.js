import { ipcRenderer } from 'electron'

/**
 * tag
 *
 * @typedef {Object} Tag
 * @property {number} id
 * @property {string} text
 * @property {string} color
 */

/**
 * image
 *
 * @typedef {Object} Image
 * @property {number} id
 * @property {string} path
 */

/**
 *
 * @returns {Array.<Image>}
 */
function reloadImages() {
  return ipcRenderer.sendSync('reload-images-sync')
}

/**
 *
 * @returns {Array.<Image>}
 */
function getAllImages() {
  return ipcRenderer.sendSync('get-all-images-sync') || []
}

/**
 *
 * @returns {Array.<Tag>}
 */
function getAllTags() {
  return ipcRenderer.sendSync('get-all-tags-sync') || []
}

/**
 *
 * @param {string} path
 * @returns {Array.<Tag>}
 */
function getTagsByImage(path) {
  return ipcRenderer.sendSync('get-tags-by-image-sync', { path }) || []
}

/**
 *
 * @param {string} text
 * @returns {Array.<Image>}
 */
function getImagesByTag(text) {
  return ipcRenderer.sendSync('get-images-by-tag-sync', { text }) || []
}

/**
 *
 * @param {string} imagePath
 * @param {string} tagText
 */
function addTagByImage(imagePath, tagText) {
  ipcRenderer.send('add-image-tag', {
    path: imagePath,
    tag: tagText,
  })
}

/**
 *
 * @param {string} tagText
 * @param {boolean} [force=false]
 * @returns {boolean}
 */
function deleteTag(tagText, force = false) {
  return ipcRenderer.sendSync('delete-tag-sync', {
    text: tagText,
    force,
  })
}

/**
 *
 * @param {string} text
 * @param {string} [color='#fff']
 */
function addTag(text, color = '#fff') {
  ipcRenderer.sendSync('add-tag-sync', {
    text,
    color,
  })
}

/**
 *
 * @param {string} imagePath
 * @param {string} tagText
 */
function deleteTagByImage(imagePath, tagText) {
  ipcRenderer.send('delete-image-tag', {
    path: imagePath,
    tag: tagText,
  })
}

/**
 *
 * @param {string} imagePath
 */
function deleteImage(imagePath) {
  ipcRenderer.send('delete-image', { path: imagePath })
}

function deleteImages(imagePathLike) {
  ipcRenderer.send('delete-images', { path: imagePathLike })
}

export default{
  reloadImages,
  getTagsByImage,
  getImagesByTag,
  deleteTagByImage,
  addTagByImage,
  getAllTags,
  getAllImages,
  deleteTag,
  addTag,
  deleteImage,
  deleteImages,
}
