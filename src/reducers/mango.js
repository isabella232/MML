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

import {
   INDEX_GEOLOCATIONS_BY_DATE_SUCCESS,
   INDEX_PHONECALLS_BY_DATE_SUCCESS,
   INDEX_FAVORISPOINT_SUCCESS
} from '../constants/actionTypes'

// indexing using cozy-stack mango
export const geolocationsIndexByDate = (state = null, action) => {
  switch (action.type) {
    case INDEX_GEOLOCATIONS_BY_DATE_SUCCESS:
      return action.geoIndex
    default:
      return state
  }
}
export const phonecallsIndexByDate = (state = null, action) => {
  switch (action.type) {
    case INDEX_PHONECALLS_BY_DATE_SUCCESS:
      return action.phoneIndex
    default:
      return state
  }
}
export const favorispointIndex = (state = null, action) => {
  switch (action.type) {
    case INDEX_FAVORISPOINT_SUCCESS:
      return action.favorisIndex
    default:
      return state
  }
}
export default combineReducers({
  geolocationsIndexByDate,
  phonecallsIndexByDate,
  favorispointIndex
})
