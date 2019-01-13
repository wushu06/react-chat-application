import React from 'react';
import firebase from "../../firebase";
import {List,  Typography, Modal,Button, InputLabel, Input,FormControl, Icon,Fab,  ListItemText,  MenuItem} from '@material-ui/core';

import {connect} from 'react-redux';
import {setCurrentChannel, setPrivateChannel} from '../../actions'



class ChannelPanel extends React.Component {
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
        value: 'recents',
    };

    componentDidMount(){

        let loadChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadChannels.push(snap.val());
            // console.log(loadedChannels);
            this.setState({channels: loadChannels}, ()=> {this.setFirstChannel()} )
        })

    }

    componentWillUnmount() {
        this.removeListeners();
    }
    removeListeners = () => {
        this.state.channelsRef.off()
    }
    setFirstChannel = () => {
        let firstChannel = this.state.channels[0];
        if(this.state.channels.length > 0 && this.state.firstLoad) {
            this.props.setCurrentChannel(firstChannel)
        }
        this.setState({firstLoad: false});
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    handleSubmit = event => {
        event.preventDefault();
        const {name, desc} = this.state
        if(this.isFormValid(this.state)){
            event.preventDefault();
            this.addChannel()
        }
    }
    isFormValid = ({name}) => this.state.name && this.state.desc;
    handleChange = event => {

        this.setState({[event.target.name] : event.target.value})
    }
    handleChangeBtn = (event, value) => {
        this.setState({ value });
    }
    addChannel = () => {
        const {name, desc, channelsRef, user}= this.state;

        const key = channelsRef.push().key

        const newChannel = {
            id: key,
            name: name,
            desc: desc,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelsRef
            .child(key)
            .update(newChannel)
            .then(()=> {
                this.setState({name: '', desc: ''})
                this.handleClose();
            })
            .catch(err=> {
                console.log(err);
            })

    }

    changeChannel = channel => {

        this.props.setCurrentChannel(channel);
        this.setState({active: channel.id});
        this.props.setPrivateChannel(false);
    }

    displayChannels = (classes, channels) => (

        channels.map((channel, i)=> (

                <MenuItem key={i} className={ channel.id === this.state.active ? 'active' : ''}  onClick={()=> {this.changeChannel(channel)}}>
                    <Icon>link_icon</Icon> <ListItemText  inset primary={channel.name} />
                </MenuItem>
            )
        )


    )


    render() {
        const { classes, currentUser } = this.props;
        const {loading, channels, value} = this.state;

        return (
            <div>
            <MenuItem className="main-item">
                <List className="btn-wrapper"   onClick={this.handleOpen}>
                    <span >Channel</span>
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
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div  className={classes.paperModal}>
                        <Typography variant="h6" id="modal-title">
                            Add channel
                        </Typography>
                        <form style={{margin: 'auto'}}   >
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="text">Channel name</InputLabel>
                                <Input
                                    onChange={this.handleChange}
                                    id="name" name="name" type="text" autoComplete="name" autoFocus />
                            </FormControl>
                            <FormControl margin="normal"  fullWidth>
                                <InputLabel htmlFor="desc">Description</InputLabel>
                                <Input
                                    onChange={this.handleChange}
                                    id="desc" name="desc" type="text" autoComplete="Description" />
                            </FormControl>
                            <div  style={{marginTop: '15px'}}></div>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                                disabled={loading}
                                style={{marginRight: '15px'}}

                            >
                                Add
                            </Button>

                            <Button

                                variant="contained"
                                color="primary"
                                onClick={this.handleClose}
                                disabled={loading}

                            >
                               Cancel
                            </Button>
                        </form>

                    </div>
                </Modal>



                {this.displayChannels(classes, channels)}
    </div>
        )
    }
}



export default connect(null, {setCurrentChannel, setPrivateChannel})(ChannelPanel);