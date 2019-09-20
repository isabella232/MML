/*
 * Copyright (C) 2018 - 2019 Orange
 * 
 * This software is distributed under the terms and conditions of the 'MIT'
 * license which can be found in the file 'LICENSE.txt' in this package distribution 
 * or at https://spdx.org/licenses/MIT
 *
 */

 /* Orange contributed module for use on CozyCloud platform
 * 
 * Module name: MML - Mapping My Life
 * Version:     1.0.5
 * Created:     2018 by Orange
 */


'use strict'

const CopyPlugin = require('copy-webpack-plugin')

const build = /:production$/.test(process.env.NODE_ENV)

module.exports = {
  plugins: [
    new CopyPlugin([
      {from: 'src/vendor/assets'},
      {from: 'manifest.webapp', transform: transformManifest},
      {from: 'README.md'}
    ])
  ]
}

// Method to modify the manifest slug on dev builds. On production builds the
// manifest should be copied without modification.
//
// For dev builds we use the generic "app" slug to share the same application
// domain for each applications.
function transformManifest (buffer) {
  if (build) {
    return buffer
  }
  const content = JSON.parse(buffer.toString())
  content.slug = 'app'
  return JSON.stringify(content, null, '  ')
}
