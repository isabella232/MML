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


/* global $ */
import { RECEIVE_TOP_GEOLOCATIONS, RECEIVE_TOP_PHONECALLS, FETCH_TOP_GEOLOCATIONS_FAILURE, FETCH_TOP_PHONECALLS_FAILURE } from '../constants/actionTypes'
import { GEOLOCATION_DOCTYPE, PHONECALL_DOCTYPE } from '../constants/config'
import orderBy from 'lodash/orderBy'
import reduce from 'lodash/reduce'

const applicationElement = document.querySelector('[role=application]')
const cozyOptions = {
  cozyURL: `//${applicationElement.dataset.cozyDomain}`,
  token: applicationElement.dataset.cozyToken
}
const PROTOCOL = window.location.protocol

const getPhoneCommunicationLogURL = PROTOCOL + cozyOptions.cozyURL + '/data/' + PHONECALL_DOCTYPE + '/_all_docs?include_docs=true'
const getGeoPointURL = PROTOCOL + cozyOptions.cozyURL + '/data/' + GEOLOCATION_DOCTYPE + '/_all_docs?include_docs=true'

export const receiveTopGeolocations = (topGeolocations) => ({
  type: RECEIVE_TOP_GEOLOCATIONS,
  topGeolocations: topGeolocations
})

export const receiveTopPhonecalls = (topPhonecalls) => ({
  type: RECEIVE_TOP_PHONECALLS,
  topPhonecalls: topPhonecalls
})

const getTopGeoValue = (values) => {
  let result = reduce(values, function (result, value) {
    ((result[(value.latitude).toString() + ',' + (value.longitude).toString()]) || (result[(value.latitude).toString() + ',' + (value.longitude).toString()] = [])).push(
      {
        start: value.timestamp.replace(/T|Z/g, ' '),
        msisdn: value.msisdn,
        _id: value._id
      })
    return result
  }, [])
  let geoLog = []
  for (let key in result) {
    if (result.hasOwnProperty(key)) {
      let item = {}
      item.latitude = Number(key.split(',')[0])
      item.longitude = Number(key.split(',')[1])
      item.geoInfo = result[key]
      geoLog.push(item)
    }
  }
  geoLog = orderBy(geoLog, ['geoInfo'], ['desc'])
  return geoLog.slice(0, 5)
}
const getTopPhoneValue = (values) => {
  let result = reduce(values, function (result, value) {
    ((result[(value.latitude).toString() + ',' + (value.longitude).toString()]) || (result[(value.latitude).toString() + ',' + (value.longitude).toString()] = [])).push(
      {
        start: value.timestamp.replace(/T|Z/g, ' '),
        msisdn: value.msisdn,
        partner: value.partner,
        typeMessage: value.type,
        _id: value._id
      })
    return result
  }, [])
  let phoneLog = []
  for (let key in result) {
    if (result.hasOwnProperty(key)) {
      let item = {}
      item.latitude = Number(key.split(',')[0])
      item.longitude = Number(key.split(',')[1])
      item.phoneInfo = result[key]
      phoneLog.push(item)
    }
  }
  phoneLog = orderBy(phoneLog, ['phoneInfo'], ['desc'])
  return phoneLog.slice(0, 5)
}
export const fetchTopGeolocations = () => {
  return dispatch => {
    cozy.client.data.findAll(GEOLOCATION_DOCTYPE)
    .then((data) => {
        let result = []
        if (data && data.length) {
          result = data.filter(function (obj) {
            return obj.latitude !== 'NULL' && obj.latitude !== '' &&
            obj.longitude !== 'NULL' && obj.longitude !== '' && obj.latitude !== undefined &&
            obj.longitude !== undefined
          })
        }
        let topGeolocations = getTopGeoValue(result)
        dispatch(receiveTopGeolocations(topGeolocations))
    })
    .catch((error) => {
        dispatch({
          type: FETCH_TOP_GEOLOCATIONS_FAILURE,
          error
        })
    })
  }
}
export const fetchTopPhonecalls = () => {
  return dispatch => {
    cozy.client.data.findAll(PHONECALL_DOCTYPE)
    .then((data) => {
        console.log(data)
        let result = []
        if (data && data.length) {
          result = data.filter(function (obj) {
            return obj.latitude !== 'NULL' && obj.latitude !== '' &&
            obj.longitude !== 'NULL' && obj.longitude !== '' && obj.latitude !== undefined &&
            obj.longitude !== undefined
          })
        }
        let topPhonecalls = getTopPhoneValue(result)
        dispatch(receiveTopPhonecalls(topPhonecalls))
    })
    .catch((error) => {
        dispatch({
          type: FETCH_TOP_PHONECALLS_FAILURE,
          error
        })
    })
  }
}

// export const fetchTopGeolocations = (geoIndexByDate) => {
//   return async dispatch => {
//     const options = {
//       selector: {
//         docType: GEOLOCATION_DOCTYPE
//       },
//       fields: ['_id', 'timestamp', 'latitude', 'longitude', 'msisdn', 'radius'],
//       descending: true,
//       limit: 10000
//     }
//     return cozy.client.data.query(geoIndexByDate, options)
//     .then((topGeo) => {
//       let topGeolocations = getTopGeoValue(topGeo)
//       dispatch(receiveTopGeolocations(topGeolocations))
//       return topGeolocations
//     })
//     .catch((error) => {
//       dispatch({
//         type: FETCH_TOP_GEOLOCATIONS_FAILURE,
//         error
//       })
//     })
//   }
// }
// export const fetchTopPhonecalls_old = (phoneIndexByDate) => {
//   return async dispatch => {
//     const options = {
//       selector: {
//         docType: PHONECALL_DOCTYPE,
//         '$and': [
//           {
//             'latitude': {'$ne': 'NULL'}
//           },
//           {
//             'longitude': {'$ne': 'NULL'}
//           },
//           {
//             'latitude': {'$ne': ''}
//           },
//           {
//             'longitude': {'$ne': ''}
//           }
//         ]
//       },
//       limit: 10000,
//       descending: true,
//       fields: ['_id', 'timestamp', 'latitude', 'longitude', 'msisdn', 'type', 'partner']
//
//     }
//     return cozy.client.data.query(phoneIndexByDate, options)
//     .then((topPhone) => {
//       let topPhonecalls = getTopPhoneValue(topPhone)
//       dispatch(receiveTopPhonecalls(topPhonecalls))
//       return topPhonecalls
//     })
//     .catch((error) => {
//       dispatch({
//         type: FETCH_TOP_PHONECALLS_FAILURE,
//         error
//       })
//     })
//   }
// }
