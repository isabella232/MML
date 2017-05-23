/* global cozy */

import { RECEIVE_TOP_GEOLOCATIONS, RECEIVE_TOP_PHONECALLS, FETCH_TOP_GEOLOCATIONS_FAILURE, FETCH_TOP_PHONECALLS_FAILURE,
  FETCH_FAVORISPOINT_FAILURE, RECEIVE_FAVORISPOINT } from '../constants/actionTypes'
import { GEOLOCATION_DOCTYPE, PHONECALL_DOCTYPE, FAVORISPOINT_DOCTYPE } from '../constants/config'
import _ from 'lodash'
import reduce from 'lodash/fp'
import orderBy from 'lodash/fp'

export const receiveTopGeolocations = (topGeolocations) => ({
  type: RECEIVE_TOP_GEOLOCATIONS,
  topGeolocations: topGeolocations
})

export const receiveTopPhonecalls = (topPhonecalls) => ({
  type: RECEIVE_TOP_PHONECALLS,
  topPhonecalls: topPhonecalls
})

export const receiveFavorisPoint = (favorispoint) => ({
  type: RECEIVE_FAVORISPOINT,
  favorisPoint: favorispoint
})

const getTopGeoValue = (values) => {
  let result = _.reduce(values, function (result, value) {
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
  geoLog = _.orderBy(geoLog, ['geoInfo'], ['desc'])
  return geoLog.slice(0,5)
}
const getTopPhoneValue = (values) => {
  let result = _.reduce(values, function (result, value) {
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
  phoneLog = _.orderBy(phoneLog, ['phoneInfo'], ['desc'])
  return phoneLog.slice(0,5)
}
export const fetchTopGeolocations = (geoIndexByDate) => {
  return async dispatch => {
    const options = {
      'selector': {
        'docType': GEOLOCATION_DOCTYPE,
        },
      'fields': ['_id', 'timestamp', 'latitude', 'longitude', 'msisdn', 'radius'],
      'descending': true,
      'limit': 10000
    }
    return cozy.client.data.query(geoIndexByDate, options)
    .then((topGeo) => {
      let topGeolocations = getTopGeoValue(topGeo)
      dispatch(receiveTopGeolocations(topGeolocations))
      return topGeolocations
    })
    .catch((error) => {
      dispatch({
        type: FETCH_TOP_GEOLOCATIONS_FAILURE,
        error
      })
    })
  }
}
export const fetchTopPhonecalls = (phoneIndexByDate) => {
  return async dispatch => {
    const options = {
      'selector': {
        'docType': PHONECALL_DOCTYPE,
        '$and': [
          {
            'latitude': {'$ne': 'NULL'}
          },
          {
            'longitude': {'$ne': 'NULL'}
          },
          {
            'latitude': {'$ne': ''}
          },
          {
            'longitude': {'$ne': ''}
          }
        ]
        },
      'limit': 10000,
      'descending': true,
      'fields': ['_id', 'timestamp', 'latitude', 'longitude', 'msisdn', 'type', 'partner']

    }
    return cozy.client.data.query(phoneIndexByDate, options)
    .then((topPhone) => {
      // console.log('allphone')
      // console.log(topPhone.length)
      let topPhonecalls = getTopPhoneValue(topPhone)
      // console.log(topPhonecalls)
      dispatch(receiveTopPhonecalls(topPhonecalls))
      return topPhonecalls
    })
    .catch((error) => {
      dispatch({
        type: FETCH_TOP_PHONECALLS_FAILURE,
        error
      })
    })
  }
}
export const fetchFavorisPoint = (favorisPointIndex) => {
  return async dispatch => {
    const options = {
      'selector': {
        'docType': FAVORISPOINT_DOCTYPE,
        },
      'fields': ['_id', 'category', 'latitude', 'longitude'],
      'limit': 10000
    }
    return cozy.client.data.query(favorisPointIndex, options)
    .then((favorisPoint) => {
      dispatch(receiveFavorisPoint(favorisPoint))
      return favorisPoint
    })
    .catch((error) => {
      dispatch({
        type: FETCH_FAVORISPOINT_FAILURE,
        error
      })
    })
  }
}
