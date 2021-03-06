import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { darkBaseTheme } from 'material-ui/styles/baseThemes/darkBaseTheme'
import { deepOrange500 } from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Import Style
import styles from './App.css'

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

const enableDevTools = false

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
           {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools /> && enableDevTools}
          <div>
            <Helmet
              title="MERN Starter - Blog App"
              titleTemplate="%s - Blog App"
              meta={[
                { charset: 'utf-8' },
                {
                  'http-equiv': 'X-UA-Compatible',
                  content: 'IE=edge',
                },
                {
                  name: 'viewport',
                  content: 'width=device-width, initial-scale=1',
                },
              ]}
            />
            <Header />
            <div className={styles.container}>
              {this.props.children}
            </div>
            <Footer />
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
    user: store.user
  };
}

export default connect(mapStateToProps)(App);
