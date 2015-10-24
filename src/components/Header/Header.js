/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import styles from './Header.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Navigation from '../Navigation';

@withStyles(styles)
class Header extends Component {

  render() {
    return (
      <div className="Header">
        <div className="Header-container">
          <a className="Header-brand" href="/" onClick={Link.handleClick}>
            <img className="Header-brandImg" src={require('./skenarios-logo.png')} height="60" alt="React" />
            <span className="Header-brandTxt"></span>
          </a>
          <Navigation className="Header-nav" />
          <div className="Header-banner">
            <h1 className="Header-bannerTitle">The Hub</h1>
            <p className="Header-bannerDesc">Property Risk Management for Dummies</p>
          </div>
        </div>
      </div>
    );
  }

}

export default Header;
