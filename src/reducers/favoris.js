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


import { RECEIVE_FAVORISPOINT, ADD_FAVORIS_MAP,
  UPDATE_FAVORIS_MAP, DELETE_FAVORIS_MAP } from '../constants/actionTypes'
import omit from 'lodash/omit'

// reducer for favoris point
const favorisMap = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_FAVORISPOINT:
      return action.favorisMap
    case ADD_FAVORIS_MAP:
      return {
        ...state,
        [action.key]: {
          category: action.category,
          id: action.id
        }
      }
    case UPDATE_FAVORIS_MAP:
      return {
        ...state,
        [action.key]: {
          category: action.category,
          id: action.id
        }
      }
    case DELETE_FAVORIS_MAP:
      let newState = omit(state, [action.key])
      return newState
    default:
      return state
  }
}
export default favorisMap
