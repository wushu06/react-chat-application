import React from 'react';
import PropTypes from 'prop-types';
import {Icon,Fab,List,  MenuItem} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import UserPanel from './UserPanel';
import ChannelPanel from './ChannelPanel';
import Starred from './Starred';
import DirectMessages from './DirectMessages';

const styles = theme => ({
    paperModal: {
        position: 'fixed',
        width: '70%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        margin: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    menuItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& $primary, & $icon': {
                color: theme.palette.common.white,
            },
        },
        height: '40px'
    },
    primary: {},
    icon: {},
    paper: {
        height: '95vh',
        width: '90%',
        margin: 'auto',

    },
    fab: {

    }
});

class SidePanel extends React.Component {


    render() {
        const { classes, currentUser, open } = this.props;

        return (

            <List open={open}>



                   <UserPanel currentUser={currentUser} classes={classes}/>

                <Starred currentUser={currentUser} classes={classes}/>
                    <ChannelPanel currentUser={currentUser} classes={classes}/>
                <MenuItem className="main-item">
                    <List className="btn-wrapper">
                            <span >Direct Messages</span>
                            <span>

                                <Fab color="secondary" aria-label="add"

                                     style={{marginRight: '15px'}}
                                     size="small"
                                >
                                    <Icon>add</Icon>
                                </Fab>
                            </span>
                    </List>
                </MenuItem>
                    <DirectMessages currentUser={currentUser} classes={classes}/>

            </List>
        )
    }
}

SidePanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SidePanel);