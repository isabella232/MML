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


import React from 'react'
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import Logo from '../styles/Logo.png'
import { LinkContainer } from 'react-router-bootstrap'
import '../styles/navbar.css'

export const AppNav = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href='#'><img src={Logo} /> Mapping My Life</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer exact to='/'>
          <NavItem eventKey={1} href='/'>Home</NavItem>
        </LinkContainer>
        <LinkContainer to='/map'>
          <NavItem eventKey={2} href='/map'>Favoris</NavItem>
        </LinkContainer>
        <LinkContainer to='/trace'>
          <NavItem eventKey={3} href='/trace'>Itineraires</NavItem>
        </LinkContainer>
        <LinkContainer to='/help'>
          <NavItem eventKey={3} href='/help'>Aide</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)
export default AppNav
