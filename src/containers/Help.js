import React, { Component } from 'react';
import Page from './help.html';
var htmlDoc = {__html: Page};

export default class Help extends Component {
  constructor(props){
    super(props);
  }

  render(){
     return (<div dangerouslySetInnerHTML={htmlDoc} />)
}}
