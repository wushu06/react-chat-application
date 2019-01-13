import React from 'react';
import firebase from "../../firebase";
import { Menu,ListItemText, ListItemIcon, MenuItem, IconButton} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';



class UserPanel extends React.Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    componentDidMount() {
    }
    handleLogout = () => {
        console.log('clicked');
        firebase
            .auth()
            .signOut()
            .then(()=> {
                console.log('singed out');
            });
        this.handleClose();
    }

    render() {
        const { classes, currentUser } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (

                <MenuItem className={classes.menuItem}>

                    <ListItemIcon className={classes.icon}>
                        <div>
                        <IconButton
                            aria-label="More"
                            aria-owns={open ? 'long-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            size="small"
                            color="primary"
                            variant="contained"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={this.handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: '100px',
                                    width: 200,
                                },
                            }}
                        >
                            <MenuItem  onClick={this.handleLogout}>
                               Logout
                            </MenuItem>
                        </Menu>
                        </div>
                    </ListItemIcon>
                    <ListItemText classes={{ primary: classes.primary }} inset primary={currentUser && currentUser.displayName} />
                </MenuItem>

        )
    }
}


export default UserPanel;