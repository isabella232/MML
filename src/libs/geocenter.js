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


module.exports = (points) => {
  points = points || []
  let {latitude, longitude} = points.reduce((agg, item) => {
    agg.latitude += item.latitude
    agg.longitude += item.longitude
    return agg
  }, {latitude: 0, longitude: 0 })
  if (latitude && latitude !== 0 && longitude && longitude !== 0) {
    // TODO: it may be ugly for react app to do that.
    return [latitude / points.length, longitude / points.length]
  }
  // error, go to Paris !
  return [48.866667, 2.333333]
}
