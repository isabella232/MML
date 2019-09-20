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


import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ActionCreators from '../actions'
import { Grid, Row, Col } from 'react-bootstrap'
import TraceMap from '../components/TraceMap'
import Calendar from '../components/Calendar'
import '../styles/rowContent.css'

class ItineraryPage extends Component {
  render () {
    return (
      <Grid fluid>
        <Row>
          <Col sm={12}>
            <div className='rowContent'>
              <TraceMap data={this.props.data.path} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div className='rowContent'>
              <Calendar indexByDate={this.props.indexByDate} fetchPath={this.props.actions.fetchPath} />
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.itinerary.path,
    indexByDate: state.mango.geolocationsIndexByDate
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ActionCreators, dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItineraryPage)
