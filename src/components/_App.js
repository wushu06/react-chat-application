import React from 'react';

import {connect} from "react-redux";
import { Grid} from '@material-ui/core';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import InfoPanel from './SidePanel/InfoPanel'



class App extends React.Component {


  render() {
      const {currentUser, currentChannel, classes} = this.props

    return (
      <div className="App">
          <Grid container  spacing={16}>
              <Grid item xs={12}>
                  <Grid container  justify="center" >

                      <Grid item xs={3}>
                          <SidePanel
                              key={currentUser && currentUser.id}
                              currentUser={currentUser}
                          />
                      </Grid>
                      <Grid  item xs={7}>
                          <Messages
                              key={currentChannel && currentChannel.id}
                              currentUser={currentUser}
                              currentChannel={currentChannel}
                          />
                      </Grid>
                      <Grid item xs={2}>
                          <InfoPanel classes={classes}/>
                      </Grid>

                  </Grid>
              </Grid>

          </Grid>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
    classes: ''
});

export default connect(mapStateToProps)(App);
