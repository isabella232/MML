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

import geolocations from './geolocations'
import mango from './mango'
import date from './date'
import phonecalls from './phonecalls'
import mostpoints from './mostpoints'
import favoris from './favoris'
import itinerary from './itinerary'
const rootReducer = combineReducers({
  geolocations,
  phonecalls,
  mango,
  date,
  mostpoints,
  favoris,
  itinerary
})

// export const mustShowSelectionBar = state => state.ui.showSelectionBar || state.ui.selected.length !== 0

export default rootReducer
