# react-file-loader
This component helps you to build a file uploader very easily.
You just need to have a file input in your application and give a file to [File uploader](https://github.com/Ggayane/react-file-loader) component and it will done the "dirty" work for you :smirk:

## How to get started ?

#### Install
```
npm install
```
#### Start
```
npm start
```

## Installation

The easiest way to use react-file-loader is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

```
npm install react-file-loader --save
```

## Usage

```jsx
import FileLoader from 'react-input-validation';

<FileLoader
  file={this.state.file || null}
  requestSuccessParam='status'
  requestSuccessVal='ok'
  url={'your link here'} />
```
see more in [examples](https://github.com/Ggayane/react-file-loader/tree/master/examples)

## Props

| Name | Default | Type | Description |
|------|---------|------|-------------|
| **file?** | | object | uploaded file |
| **url?** | | string | url to upload a file |
| **preventReload?** | false | boolean | show alert dialog on page reload while file is uploading |
| **requestSuccessParam?** | | string | uploaded response param for checking |
| **requestSuccessVal?** | | string | successfully upload response param value  |
| **validFileTypes?** | ['image/jpeg', 'image/png', 'video/mp4'] | array | valid file types |
| **fileMaxSize?** | 1024 | number | uploaded file maximum size |
| **uploadFinishedCallback?** | | function | function to call after file upload is done |
| **additionalData?** | | object | additional data to send with the file: {firstName: 'John'} |

## Screenshot

![0.0.1](https://media.giphy.com/media/kkx4J09GMcZLa/giphy.gif)
