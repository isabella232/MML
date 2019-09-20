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


/* global cozy */

import {
  RECEIVE_PHONECALLS,
  FETCH_PHONECALLS_FAILURE
} from '../constants/actionTypes'

export const receivePhonecalls = (phonecalls) => ({
  type: RECEIVE_PHONECALLS,
  phonecalls
})

const selectorCraWithLoc = { '$and': [
  { 'longitude': { '$exists': true } },
  { 'latitude': { '$exists': true } },
  { 'latitude': {'$ne': null} },
  { 'longitude': {'$ne': null} },
  { 'latitude': {'$ne': 'NULL'} },
  { 'longitude': {'$ne': 'NULL'} },
  { 'latitude': {'$ne': ''} },
  { 'longitude': {'$ne': ''} },
]}

const fetchMorePhonecalls = (phoneIndexByDate, start, end, skip, previousData) => {
  const options = {
    selector: {
      '$and': [
        {
          'timestamp': {'$gt': start}
        },
        {
          'timestamp': {'$lte': end + 'T23:59:59Z'}
        },
        selectorCraWithLoc
    ]},
    fields: ['_id', 'timestamp', 'latitude', 'longitude', 'msisdn', 'type', 'partner'],
    descending: true,
    wholeResponse: true,
    skip: skip
  }
  return cozy.client.data.query(phoneIndexByDate, options)
  .then((phonecalls) => {
    if (phonecalls) {
      let hasNext = phonecalls.next
      let data = [...phonecalls.docs, ...previousData]
      let result = {'hasNext': hasNext, 'data': data}
      return result
    }
  })
  .catch((error) => {
    console.log(error)
  })
}

const loop = (phoneIndexByDate, start, end, skip, data) => {
  return fetchMorePhonecalls(phoneIndexByDate, start, end, skip, data)
  .then(
    result => {
      if (result.hasNext) {
        return loop(phoneIndexByDate, start, end, result.data.length, result.data)
      } else {
        return result
      }
    }
  )
  .catch((error) => {
    console.log(error)
  })
}

export const fetchPhonecalls = (phoneIndexByDate, start, end) => {
  return async dispatch => {
    const options = {
      selector: {
        '$and': [
          {
            'timestamp': {'$gt': start}
          },
          {
            'timestamp': {'$lte': end + 'T23:59:59Z'}
          },
          selectorCraWithLoc
        ]},
      fields: ['_id', 'timestamp', 'latitude', 'longitude', 'msisdn', 'type', 'partner'],
      descending: true,
      wholeResponse: true
    }
    return cozy.client.data.query(phoneIndexByDate, options)
    .then((phonecalls) => {
      let data = phonecalls.docs
      let hasMore = phonecalls.next
      if (hasMore) {
        let res = loop(phoneIndexByDate, start, end, data.length, data)
        res.then(
          (result) => {
            dispatch(receivePhonecalls(result.data))
          }
        )
        res.catch((error) => {
          dispatch({
            type: FETCH_PHONECALLS_FAILURE,
            error
          })
        })
      } else {
        dispatch(receivePhonecalls(data))
      }
    })
    .catch((error) => {
      dispatch({
        type: FETCH_PHONECALLS_FAILURE,
        error
      })
    })
  }
}
export const fetchPhonecallsLatest = (phoneIndexByDate) => {
  return async dispatch => {
    const options = {
      selector: {
        '$and': [
          {
            'timestamp': {'$gt': null}
          },
          selectorCraWithLoc
        ]
      },
      fields: ['_id', 'timestamp', 'latitude', 'longitude', 'msisdn', 'type', 'partner'],
      descending: true,
      limit: 30
    }
    return cozy.client.data.query(phoneIndexByDate, options)
    .then((phonecalls) => {
      dispatch(receivePhonecalls(phonecalls))
      return phonecalls
    })
    .catch((error) => {
      dispatch({
        type: FETCH_PHONECALLS_FAILURE,
        error
      })
    })
  }
}
