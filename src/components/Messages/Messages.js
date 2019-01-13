import React from 'react';
import MessagesForm from './MessagesForm';
import PropTypes from 'prop-types';
import firebase from "../../firebase";
import {Paper, Input} from '@material-ui/core';
import List from '@material-ui/core/List';

import {withStyles} from '@material-ui/core/styles';
import MessagesHeader from './MessagesHeader';
import Message from './Message';
import {connect} from 'react-redux';
import {setUserPosts} from "../../actions";

const styles = theme => ({

    paper: {
        padding: '0 20px 20px ',
        backgroundColor: '#fafafa !important',


    },
    list: {
        height: '60vh',
        overflowY: 'scroll'
    }
});

class Messages extends React.Component {

    state = {
        messageRef: firebase.database().ref('messages'),
        usersRef: firebase.database().ref('users'),
        user: this.props.currentUser,
        channel: this.props.currentChannel,
        messages: [],
        messagesLoading: true,
        modal: false,
        starredChannels: [],
        isChannelStarred: false,
        messagesRef: firebase.database().ref('messages')
    }

    testClick = () => {
        console.log('clicked');
        firebase.database().ref('channels')
            .child( firebase.database().ref('channels').push().key)
            .update({
                    id:firebase.database().ref('channels').push().key,
                    name: 'new channel',
                    desc: 'some content',
                    createdBy: {
                        name: 'some guy',
                        avatar: 'url'
                    }
                }
                )
            .then(()=> {
               // do something
            })
            .catch(err=> {
                console.log(err);
            })
    }


    openModal = () => this.setState({modal: true});
    closeModal = () => this.setState({modal: false});

    componentDidMount() {
        const {channel, user} = this.state

        if (channel && user) {
            this.addListeners(channel.id);
            this.addUserStarsListener(channel.id, user.uid)
        }


    }

    componentDidUpdate(prevProps, prevState) {
        if (this.messagesEnd) {
            this.scrollToBottom();
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    }
    addListeners = channelId => {

        this.addMessageListener(channelId);

    }

    addMessageListener = channelId => {
        let loadMessages = [];
        this.state.messageRef.child(channelId).on('child_added', snap => {
            loadMessages.push(snap.val())
            this.setState({
                messages: loadMessages,
                messagesLoading: false
            })
            this.countUserPosts(loadMessages);
        })
    }


    displayMessages = messages =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ));
    // stars
    handleStar = () => {
        this.setState(
            prevState => ({
                isChannelStarred: !prevState.isChannelStarred
            }),
            () => this.starChannel()
        );
    };

    starChannel = () => {
        if (this.state.isChannelStarred) {
            console.log(this.state.user.uid);

            // starred table under users table
            this.state.usersRef.child(`${this.state.user.uid}/starred`).update({
                // channel id as key
                [this.state.channel.id]: {
                    name: this.state.channel.name,
                    details: this.state.channel.desc,
                    createdBy: {
                        name: this.state.channel.createdBy.name,
                        avatar: this.state.channel.createdBy.avatar
                    }
                }
            });
        } else {

            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
        }
    };
    addUserStarsListener = (channelId, userId) => {
        // ref users by user id and grab child starred and get the value
        // if there is data set channel starred to true
        // we check data using includes to see if channelId is in the data retrieved
        this.state.usersRef
            .child(userId)
            .child("starred")
            .once("value")
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({isChannelStarred: prevStarred});
                }
            });
    };
    getMessagesRef = () => {
        /* const { messagesRef, privateMessagesRef, privateChannel } = this.state;
         return privateChannel ? privateMessagesRef : messagesRef;*/
        return this.state.messagesRef;
    };

    countUserPosts = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                };
            }
            return acc;
        }, {});
        this.props.setUserPosts(userPosts);
    };

    render() {
        const {currentChannel, currentUser, classes, showbtn, isPrivate, handleDrawerOpen} = this.props
        const {messages, isChannelStarred} = this.state;
        return (
            <div className="messages">
                <Input type="submit" onClick={this.testClick}/>
                {/*<MessagesHeader*/}
                    {/*handleDrawerOpen={handleDrawerOpen}*/}
                    {/*showbtn={showbtn}*/}
                    {/*isPrivate={isPrivate}*/}
                    {/*currentChannel={currentChannel} currentUser={currentUser} handleStar={this.handleStar}*/}
                    {/*isChannelStarred={isChannelStarred}/>*/}
                {/*<Paper className={classes.paper}>*/}
                    {/*<List className={classes.list}>*/}
                        {/*{this.displayMessages(messages)}*/}
                        {/*<div ref={node => (this.messagesEnd = node)} />*/}

                    {/*</List>*/}
                {/*</Paper>*/}
                {/*<MessagesForm getMessagesRef={this.getMessagesRef} currentChannel={currentChannel}*/}
                              {/*currentUser={currentUser}/>*/}
            </div>

        )
    }
}

Messages.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(null, {setUserPosts})(withStyles(styles)(Messages));
