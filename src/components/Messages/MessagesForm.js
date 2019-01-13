import React from 'react';
import {  Paper,Fab,Icon,   Input,   FormControl} from '@material-ui/core';
import firebase from "../../firebase";
import FileUpload from './FileUpload';
import uuidv4 from 'uuid/v4';
import ProgressBar from './ProgressBar'



class MessagesForm extends React.Component {
     state = {
         storageRef: firebase.storage().ref(),
         message: '',
         loading: false,
         messageRef: firebase.database().ref('messages'),
         errors: [],
         uploadState: "",
         percentUploaded: 0,
         open: false,
         channel: this.props.currentChannel,
         user: this.props.currentUser,
    }
    handleChange = event => {
         this.setState({message: event.target.value})
    }

    sendMessage = event => {
         event.preventDefault();
         const {message, messageRef} = this.state;
         const {currentUser, currentChannel}= this.props;
         if(message) {
             this.setState({loading: true})
             let newMessage = {
                 message: message,
                 timestamp: firebase.database.ServerValue.TIMESTAMP,
                 user: {
                     name: currentUser.displayName,
                     avatar: currentUser.photoURL
                 },
                 channel: {
                     name: currentChannel.name
                 }
             }
             messageRef
                 .child(currentChannel.id)
                 .push()
                 .set(newMessage)
                 .then(()=> {
                     this.setState({loading: false, message: '', errors: ''})
                 })
                 .catch(err=> {
                     console.log(err);
                     this.setState({loading: false, errors: this.state.errors.concat(err)})
                 })


         }
    }

    // file upload
    handleOpen = () => {

        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    getPath = () => {
        if (this.props.isPrivateChannel) {
            return `chat/private/${this.state.channel.id}`;
        } else {
            return "chat/public";
        }
    };

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

        this.setState(
            {
                uploadState: "uploading",
                uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
            },
            () => {
                this.state.uploadTask.on(
                    "state_changed",
                    snap => {
                        const percentUploaded = Math.round(
                            (snap.bytesTransferred / snap.totalBytes) * 100
                        );
                        this.setState({ percentUploaded });
                    },
                    err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: "error",
                            uploadTask: null
                        });
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then(downloadUrl => {
                                this.sendFileMessage(downloadUrl, ref, pathToUpload);
                            })
                            .catch(err => {
                                console.error(err);
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: "error",
                                    uploadTask: null
                                });
                            });
                    }
                );
            }
        );
    };

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref
            .child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: "done" });
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err)
                });
            });
    };
    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        };
        if (fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = this.state.message;
        }
        return message;
    };



    render() {
         const {loading, message, open, uploadState, percentUploaded} = this.state
        return (
            <Paper className="messages_header_form">
                <form style={{margin: 'auto'}} onSubmit={this.sendMessage}>
                    <FormControl margin="normal"  fullWidth>
                        <Input
                            placeholder="Write your message"
                            onChange={this.handleChange}
                            value={message}
                            id="message" name="message"  autoFocus autoComplete="false" />
                    </FormControl>

                    <br/>

                    <Fab color="secondary" aria-label="Edit"
                         onClick={this.sendMessage}
                         disabled={loading}
                         style={{marginRight: '15px'}}
                         size="small"
                    >
                        <Icon>edit_icon</Icon>
                    </Fab>
                    <Fab color="secondary" aria-label="cloud"
                         onClick={this.handleOpen}
                         open={open}
                         style={{marginRight: '15px'}}
                         size="small"
                    >
                        <Icon>cloud</Icon>
                    </Fab>

                </form>
                <FileUpload modal={open} closeModal={this.handleClose} uploadFile={this.uploadFile}/>
                <br/>
                <ProgressBar  uploadState={uploadState}
                              percentUploaded={percentUploaded}
                />

            </Paper>
        )
    }
}

export default MessagesForm;