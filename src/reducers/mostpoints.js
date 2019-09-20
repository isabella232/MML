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


import { combineReducers } from 'redux'
import { RECEIVE_TOP_GEOLOCATIONS, RECEIVE_TOP_PHONECALLS } from '../constants/actionTypes'

// reducer for top geopoints
const topGeolocations = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_TOP_GEOLOCATIONS:
      return action.topGeolocations
    default:
      return state
  }
}
// reducer for top phonecalls
const topPhonecalls = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_TOP_PHONECALLS:
      return action.topPhonecalls
    default:
      return state
  }
}

export default combineReducers({
  topGeolocations,
  topPhonecalls
})
