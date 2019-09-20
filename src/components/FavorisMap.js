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
import { Map, Marker, TileLayer, Popup } from 'react-leaflet'
import L from 'leaflet'
import isEmpty from 'lodash/isEmpty'
import { MAPBOXURL } from '../constants/config'
import { geoIcon, phoneIcon, homeIcon, workIcon, sportIcon, shopIcon, otherIcon } from './Icons'
import { Button } from 'react-bootstrap'
import geoCenter from '../libs/geocenter'
import 'leaflet-css'
import '../styles/map.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

class FavorisMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPopup: false,
      center: [48.866667, 2.333333]
    }
    this.showInfo = this.showInfo.bind(this)
    this.renderGeoMarkers = this.renderGeoMarkers.bind(this)
    this.renderPhoneMarkers = this.renderPhoneMarkers.bind(this)
    this.getIconType = this.getIconType.bind(this)
  }
  showInfo () {
    this.setState({
      showPopup: !this.state.showPopup
    })
  }

  getCategory (item) {
    let key = item.latitude.toString() + item.longitude.toString()
    if (!isEmpty(this.props.favorisPoint) &&
      this.props.favorisPoint[key] !== undefined && this.props.favorisPoint[key]['category'] !== undefined) {
      return this.props.favorisPoint[key]['category']
    }
  }

  getIconType (item, defaultIcon) {
    let typeIcon = defaultIcon
    let category = this.getCategory(item)
    if (category) {
      switch (category) {
        case 'maison':
          typeIcon = homeIcon
          break
        case 'travail':
          typeIcon = workIcon
          break
        case 'sport':
          typeIcon = sportIcon
          break
        case 'marche':
          typeIcon = shopIcon
          break
        default:
          typeIcon = otherIcon
      }
    }
    return typeIcon
  }
  renderGeoMarkers (geoLog) {
    if (geoLog.length > 0) {
      return geoLog.map((item, i) => {
        let typeIcon = this.getIconType(item, geoIcon)
        return (
          <Marker key={i} position={[item.latitude, item.longitude]} icon={typeIcon} onClick={this.props.changeLatLng}>
            <Popup>
              <div>
                <h5><b>{this.getCategory(item)}</b></h5>
                <h5>Nombre de geolocation = {item.geoInfo.length}</h5>
                <div style={{ display: this.state.showPopup ? 'block' : 'none' }} className='popupContent'>
                  {item.geoInfo.map((item, i) =>
                    <div key={i} className='geoPopup'>
                      <p >Timestamp: {item.start}</p>
                    </div>
                  )}
                </div>
                <Button bsSize='small' bsStyle='success' onClick={this.showInfo}>{this.state.showPopup ? 'Cache' : 'Afficher'}</Button>
              </div>
            </Popup>
          </Marker>
        )
      }
    )
    } else {
      return <p>error</p>
    }
  }
  renderPhoneMarkers (phoneLog) {
    if (phoneLog.length > 0) {
      return phoneLog.map((item, i) => {
        let typeIcon = this.getIconType(item, phoneIcon)
        return (
          <Marker key={i} position={[item.latitude, item.longitude]} icon={typeIcon} onClick={this.props.changeLatLng}>
            <Popup>
              <div>
                <h5><b>{this.getCategory(item)}</b></h5>
                <h5>Nombre de communications = {item.phoneInfo.length}</h5>
                <div style={{ display: this.state.showPopup ? 'block' : 'none' }} className='popupContent'>
                  {item.phoneInfo.map((item, i) =>
                    <div key={i} className='phonePopup'>
                      <p>Timestamp: {item.start}</p>
                      <p>Numéro de contact: {item.partner}</p>
                      <p>Type d'appel: {item.typeMessage}</p>
                    </div>
                  )}
                </div>
                <Button bsSize='small' bsStyle='success' onClick={this.showInfo}>{this.state.showPopup ? 'Cache' : 'Afficher'}</Button>
              </div>
            </Popup>
          </Marker>
        )
      }
        )
    } else {
      return <p>error</p>
    }
  }

  render () {
    const {geolocations, phonecalls} = this.props
    const geomarkers = this.renderGeoMarkers(geolocations)
    const phonemarkers = this.renderPhoneMarkers(phonecalls)

    if (geolocations.length > 0 || phonecalls.length > 0) {
      // TODO: it may not be very react-like.
      this.state.center = geoCenter([].concat(geolocations, phonecalls))
    }

    return (
      <div>
        <Map center={this.state.center} zoom={13} maxZoom={20}>
          <TileLayer
            url={MAPBOXURL}
            maxZoom={20}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {geomarkers}
          {phonemarkers}
        </Map>

      </div>
    )
  }
}

export default FavorisMap
