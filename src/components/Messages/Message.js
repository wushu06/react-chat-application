import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import moment from 'moment';

// destructure props
const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__self': ''
}
const timeFromNow = timestamp => moment(timestamp).fromNow();

const isImage = (message)=> {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
}

const styles = theme => ({
    text: {
        paddingTop: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    paper: {
        paddingBottom: 50,
    },
    list: {

    },
    subHeader: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    toolbar: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
    },
});


class Message extends React.Component{
    render() {
        const {classes, message, user} = this.props;
        return (
            <React.Fragment>
               
                <Paper square >

                    <List className={classes.list}>

                        <Fragment key={message.timestamp}>
                            <ListSubheader className={classes.subHeader}>{timeFromNow(message.timestamp) }</ListSubheader>
                            <ListItem button>
                                <Avatar alt="Profile Picture" src={message.user.avatar}/>
                                <ListItemText primary={ message.user.name} secondary={
                                    <React.Fragment>
                                     <span>{isImage(message) ? <img src={message.image} className="message_image"/> :
                                       <strong>{message.message}</strong>} </span>
                                    </React.Fragment>
                                }/>
                            </ListItem>
                        </Fragment>

                    </List>
                </Paper>

            </React.Fragment>
        );
    }
}

Message.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Message);
