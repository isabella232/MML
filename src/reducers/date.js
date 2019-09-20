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


import {
  FETCH_GEO_LAST_DAY,
  SELECT_DATE
} from '../constants/actionTypes'

// reducer for geopoints
const date = (state = {}, action) => {
  switch (action.type) {
    case FETCH_GEO_LAST_DAY:
      return {
        ...state,
        start: action.date,
        end: action.date
      }
    case SELECT_DATE:
      return {
        ...state,
        start: action.date.start,
        end: action.date.end
      }
    default:
      return state
  }
}
export default date
