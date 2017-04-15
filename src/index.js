import React, { Component } from 'react'
import { addFileLoaderListener, removeFileLoaderListener } from './utils'
import './style/main.scss'

export default class FileLoader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      percentage: 0,
      error: false,
      errorMessage: '',
      uploaded: false,
      uploadStatus: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.file && this.validateFile(nextProps.file)) {
      this.uploadFile(nextProps.file, nextProps.url)
    }
  }

  componentDidMount () {
    if (this.props.file && this.validateFile(this.props.file)) {
      this.uploadFile(this.props.file, this.props.url)
    }
  }

  setUploadedPercentage (percentage) {
    this.setState({percentage})
  }

  uploadFile (file, url) {
    const { requestSuccessParam, requestSuccessVal, preventReload, uploadFinishedCallback, additionalData } = this.props
    if (preventReload) {
      addFileLoaderListener()
    }
    this.setState({loading: true})

    const formData = new FormData()
    formData.append('files', file)
    if (additionalData) {
      for (const param in additionalData) {
        if (param) {
          const val = additionalData[param]
          formData.append(param, val)
        }
      }
    }
    const req = new XMLHttpRequest()
    req.open('POST', url)

    req.addEventListener('load', (e) => {
      const uploadStatus = JSON.parse(req.response)[requestSuccessParam] === requestSuccessVal ? 'done' : 'error'
      if (uploadFinishedCallback) {
        uploadFinishedCallback()
      }
      this.uploadFinished({uploaded: true, uploadStatus})
    }, false)

    req.addEventListener('error', (e) => {
      this.uploadFinished({uploaded: true, uploadStatus: 'failed'})
    }, false)

    req.upload.addEventListener('progress', (e) => {
      const percentage = parseInt((e.loaded / e.total) * 100, 10)
      this.setUploadedPercentage(percentage)
    }, false)

    req.send(formData)
    return req
  }

  cancelUpload () {
    this.uploadFile().abort()
    this.uploadFinished({uploaded: true, uploadStatus: 'canceled'})
  }

  uploadFinished (data) {
    this.setState({ ...data })
    if (this.props.preventReload) {
      removeFileLoaderListener()
    }
  }

  validateFile (file) {
    const {validFileTypes, fileMaxSize} = this.props
    if (validFileTypes.indexOf(file.type) < 0) {
      this.setState({
        error: true,
        errorMessage: 'Not a valid file type!'
      })
      return false
    }
    if (file.size <= fileMaxSize) {
      this.setState({
        error: true,
        errorMessage: 'File size is too big!'
      })
      return false
    }
    this.setState({
      error: false,
      errorMessage: '',
      uploaded: false,
      loading: false
    })
    return true
  }

  generateStatusClassName () {
    const { loading, uploaded, uploadStatus } = this.state
    if (loading) {
      if (uploaded) {
        switch (uploadStatus) {
          case 'done':
            return ' show finished success'
          case 'failed':
            return ' show finished failed'
          case 'error':
            return ' show finished error'
          case 'canceled':
            return ' show finished canceled'
        }
      }
      return ' show'
    }
    return ''
  }

  showLoader () {
    const {percentage, error} = this.state
    if (error) {
      return this.showErrorMsg()
    }
    const style = {width: percentage + '%'}
    return (
      <div className='file_progress-wrapper'>
        <div className='file_progress' style={style}>
          <span className={'file_progress-status' + (this.generateStatusClassName())}>{this.LoadingProcess()}</span>
        </div>
        {this.props.showCancelBtn ? this.showCancelBtn() : ''}
      </div>
    )
  }

  LoadingProcess () {
    const {percentage, uploaded, uploadStatus} = this.state
    if (uploaded) {
      return uploadStatus
    }
    return percentage + '%'
  }

  showErrorMsg () {
    const {errorMessage} = this.state
    return (
      <div className='error_msg'>
        {errorMessage}
      </div>
    )
  }

  showCancelBtn () {
    return (
      <div className='cancel_btn-wrapper'>
        <button type='button' className='cancel_btn' onClick={() => this.cancelUpload()}>Cancel</button>
      </div>
    )
  }

  render () {
    return this.props.file ? this.showLoader() : null
  }
}

FileLoader.propTypes = {
  file: React.PropTypes.object,
  url: React.PropTypes.string.isRequired,
  preventReload: React.PropTypes.bool,
  requestSuccessParam: React.PropTypes.string.isRequired,
  requestSuccessVal: React.PropTypes.string.isRequired,
  validFileTypes: React.PropTypes.array,
  fileMaxSize: React.PropTypes.number,
  uploadFinishedCallback: React.PropTypes.func,
  additionalData: React.PropTypes.object
}

FileLoader.defaultProps = {
  validFileTypes: ['image/jpeg', 'image/png', 'video/mp4'],
  fileMaxSize: 1024
}
