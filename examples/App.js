import React, { Component } from 'react'
import FileLoader from '../src/index.jsx'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null
    }
  }

  uploadFile (e) {
    this.setState({file: e.target.files[0]})
  }

  render () {
    return (
      <div style={{width: '500px', margin: '0 auto'}}>
        <h2 style={{textAlign: 'center'}}>Demo Of File Loader</h2>
        <input type='file' onChange={(e) => this.uploadFile(e)} />
        <FileLoader
          showCancelBtn
          file={this.state.file || null}
          requestSuccessParam='status'
          requestSuccessVal='ok'
          url='http://t.renderforest.com:3000/api/v1/usermedia/' />
      </div>
    )
  }
}
