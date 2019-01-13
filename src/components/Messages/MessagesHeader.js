import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Icon from '@material-ui/core/Icon';
import ListSubheader from '@material-ui/core/ListSubheader';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';


const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,

    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },


});
class MessagesHeader extends React.Component{

    render(){
        const {currentUser, currentChannel, handleStar, isChannelStarred, classes, showbtn,isPrivate, handleDrawerOpen}= this.props
        return(
        <div className={classes.root}>
            <AppBar position="static"   >
                <Toolbar>
                    {showbtn ?
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={handleDrawerOpen}
                           /* className={classNames(classes.menuButton, open && classes.hide)}*/
                        >
                            <MenuIcon/>
                        </IconButton>
                        : ''
                    }
                    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                        <div className="messages_header">
                            <ListSubheader>
                                {currentUser && currentUser.displayName}@<strong>{currentChannel && currentChannel.name}</strong>
                            </ListSubheader>
                            {isPrivate ? '' :
                                <ListSubheader onClick={handleStar} style={{cursor: 'pointer', padding: '10px 0 0'}}>
                                    <Icon> {isChannelStarred ? `star_icon` : `star_border_icon`}</Icon>
                                </ListSubheader>
                            }
                        </div>


                    </Typography>
                    <div className={classes.grow}/>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                        />
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
}

MessagesHeader.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessagesHeader);