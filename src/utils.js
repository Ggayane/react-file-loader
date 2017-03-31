/* global String */
const Promise = require('bluebird')
const assign = require('object-assign')

function sortFactory (prop) {
  return function (a, b) {
    return parseInt(a[prop], 10) - parseInt(b[prop], 10)
  }
}

function alertError (err) {
  console.log(err)
  alert(err.message || err)
}

function preloadImage (url) {
  if (!Image) {
    return
  }
  var img = new Image()
  img.src = url
}

function areaTransform (componentBox, area) {
  var coef = setCoef()
  var transform = new PerspectiveTransform(componentBox, area.width, area.height, true)

  if (area.type === 'text') {
    transform.topLeft.x = parseInt(area.x_1) * coef.template_editor_width / coef.coef_width
    transform.topLeft.y = parseInt(area.y_1) * coef.template_editor_height / coef.coef_height
    transform.topRight.x = parseInt(area.x_2) * coef.template_editor_width / coef.coef_width
    transform.topRight.y = parseInt(area.y_1) * coef.template_editor_height / coef.coef_height
    transform.bottomLeft.x = parseInt(area.x_1) * coef.template_editor_width / coef.coef_width
    transform.bottomLeft.y = parseInt(area.y_3) * coef.template_editor_height / coef.coef_height
    transform.bottomRight.x = parseInt(area.x_2) * coef.template_editor_width / coef.coef_width
    transform.bottomRight.y = parseInt(area.y_3) * coef.template_editor_height / coef.coef_height
  } else {
    transform.topLeft.x = parseInt(area.x_1) * coef.template_editor_width / coef.coef_width
    transform.topLeft.y = parseInt(area.y_1) * coef.template_editor_height / coef.coef_height
    transform.topRight.x = parseInt(area.x_2) * coef.template_editor_width / coef.coef_width
    transform.topRight.y = parseInt(area.y_2) * coef.template_editor_height / coef.coef_height
    transform.bottomLeft.x = parseInt(area.x_4) * coef.template_editor_width / coef.coef_width
    transform.bottomLeft.y = parseInt(area.y_4) * coef.template_editor_height / coef.coef_height
    transform.bottomRight.x = parseInt(area.x_3) * coef.template_editor_width / coef.coef_width
    transform.bottomRight.y = parseInt(area.y_3) * coef.template_editor_height / coef.coef_height
  }

  if (transform.checkError() === 0) {
    transform.update()
  }
}

function setCoef () {
  var coefwidth = 1099
  var coefheight = 601
  var coeficent = coefwidth / coefheight
  var width = $('.bigscreen-wrapper').width()
  return {
    coef_width: coefwidth,
    coef_height: coefheight,
    coef: coeficent,
    template_editor_width: width,
    template_editor_height: width / coeficent
  }
}

function checkRtl (string) {
  var hebrew = /[\u0590-\u05FF]/
  var hebrew1 = /[\ufb1d-\ufb4f]/
  var arabicPersian = /[\u0600-\u06FF]/
  var arabic2 = /[\u0750-\u077f]/
  var arabic3 = /[\ufb50-\ufc3f]/
  var arabic4 = /[\ufe70-\ufefc]/

  var rtlChars = [hebrew, hebrew1, arabicPersian, arabic2, arabic3, arabic4]
  var rtl = false
  for (var i in rtlChars) {
    var cRange = rtlChars[i]
    if (cRange.test(string)) {
      rtl = true
      break
    }
  }
  return rtl
}

function testWebP (callback, feature) {
  feature = feature || 'lossy'
  var kTestImages = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
  }
  var img = new Image()
  img.onload = function () {
    var result = (img.width > 0) && (img.height > 0)
    callback(result, feature)
  }
  img.onerror = function () {
    callback(false, feature)
  }
  img.src = 'data:image/webp;base64,' + kTestImages[feature]
}

function regEvent (data) {
  ga && ga('send', 'event', data)
}

function getNthPosition (str, m, i) {
  return str.split(m, i).join(m).length
}

function bytesToSize (bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) {
    return '0 Byte'
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

function getFromApi (url, dataMember) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      contentType: 'application/json;charset=utf-8',
      xhrFields: {withCredentials: true}
    }).done(function (data) {
      if (data && data.status === 'ok') {
        return resolve(data[dataMember])
      }
      reject(data.error)
    }).fail(function (err) {
      reject(err)
    })
  })
}

function rAjax (_options) {
  return new Promise((resolve, reject) => {
    const options = assign({}, {
      dataType: 'json',
      type: 'GET',
      xhrFields: {withCredentials: true},
      contentType: 'application/json;charset=utf-8',
      checkData: true
    }, _options)

    if (options.type !== 'GET') {
      options.data = JSON.stringify(options.data)
    }

    $.ajax(options).done(data => {
      if (options.checkData === false) return resolve(data)

      if (data && data.status === 'ok') {
        resolve(data)
      } else {
        reject(new Error(data.message))
      }
    }).fail(err => {
      console.log(err)
      return reject(err)
    })
  })
}

function formatVideoTime (duration) {
  let minutes = Math.floor(duration / 60)
  minutes = (minutes >= 10) ? minutes : `0${minutes}`
  let seconds = Math.floor(duration % 60)
  seconds = (seconds >= 10) ? seconds : `0${seconds}`
  return `${minutes}:${seconds}`
}

function addFileLoaderListener () {
  window.addEventListener('beforeunload', beforeunloadFn)
}

function removeFileLoaderListener () {
  window.removeEventListener('beforeunload', beforeunloadFn)
}

function beforeunloadFn (e) {
  e.preventDefault()
  return e.returnValue = 'Are you sure you want to leave?'
}

module.exports = {
  rAjax,
  sortFactory,
  alertError,
  preloadImage,
  areaTransform,
  checkRtl,
  testWebP,
  regEvent,
  getNthPosition,
  bytesToSize,
  getFromApi,
  formatVideoTime,
  addFileLoaderListener,
  removeFileLoaderListener
}
