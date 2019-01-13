import React from 'react';
import firebase from "../../firebase";
import {Chip,ypography, MenuItem} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';



class Users extends React.Component {
    state = {
        open: false,
        loading: false,
        name: '',
        active: false,
        desc: '',
        firstLoad: true,
        users: [],
        usersRef: firebase.database().ref('users'),
        user: this.props.currentUser
    };

    componentDidMount(){

        let loadUsers = [];
        this.state.usersRef.on('child_added', snap => {
            loadUsers.push(snap.val());
            this.setState({users: loadUsers} )
        })

    }

    componentWillUnmount() {
        this.removeListeners();
    }
    removeListeners = () => {
        this.state.usersRef.off()
    }


    changeUser = user => {

        this.setState({active: user.name})
    }

    displayUsers = (classes, users) => (

        users.map((user, i)=> (

                <MenuItem key={i} className={user.name === this.state.active ? 'active' : ''}  onClick={()=> {this.changeUser(user)}}>
                   {/* <Icon>link_icon</Icon> <ListItemText  inset primary={user.name} />*/}
                    <Chip
                        icon={<FaceIcon />}
                        label={user.name}
                        color="primary"
                        variant="outlined"
                    />
                </MenuItem>
            )
        )


    )


    render() {
        const { classes, currentUser } = this.props;
        const {loading, users} = this.state;

        return (
            <div>

                {this.displayUsers(classes, users)}
            </div>
        )
    }
}



export default Users;