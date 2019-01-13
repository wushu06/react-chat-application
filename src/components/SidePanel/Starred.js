import React from 'react';
import firebase from "../../firebase";
import {List, ListItem, Icon, ListItemText} from '@material-ui/core';
import {connect} from 'react-redux';
import {setCurrentChannel} from '../../actions'

class Starred extends React.Component {
    state = {
        open: false,
        loading: false,
        name: '',
        active: false,
        desc: '',
        firstLoad: true,
        channels: [],
        channelsRef: firebase.database().ref('channels'),
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        starredChannels: []
    };

    componentDidMount(){
        if(this.state.user){
            this.addListeners(this.state.user.uid)
        }


    }

    componentWillUnmount() {

    }

    changeChannel = channel => {
        this.props.setCurrentChannel(channel);
        this.setState({active: channel.id})
    }

    displayChannels = (classes, channels) => (

        channels.map((channel, i)=> (
            <List key={i}>
                <ListItem button  className={ channel.id === this.state.active ? 'active' : ''} onClick={()=> {this.changeChannel(channel)}}>
                    <ListItemText primary={channel.name}/>
                </ListItem>
            </List>


            )
        )


    )

    // display starred channels
    addListeners = userId => {

        this.state.usersRef
            .child(userId)
            .child("starred")
            .on("child_added", snap => {
                const starredChannel = { id: snap.key, ...snap.val() };
                this.setState({
                    starredChannels: [...this.state.starredChannels, starredChannel]
                });
            });

        this.state.usersRef
            .child(userId)
            .child("starred")
            .on("child_removed", snap => {
                const channelToRemove = { id: snap.key, ...snap.val() };
                const filteredChannels = this.state.starredChannels.filter(channel => {
                    return channel.id !== channelToRemove.id;
                });
                this.setState({ starredChannels: filteredChannels });
            });
    };

    render() {
        const { classes, starredChannels } = this.state;
        return (
            <List >
                <List className="main-item">
                    <ListItem button  >
                        <ListItemText primary="starred" />
                         <Icon>grade_icon</Icon><span style={{color: '#B3B2BB'}}>({starredChannels.length})</span>
                    </ListItem>

                </List>
                {this.displayChannels(classes, starredChannels)}

            </List>




        )
    }
}

export default connect(null, {setCurrentChannel})(Starred);