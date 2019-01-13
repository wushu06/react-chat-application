import React from 'react';
import {Grid, Drawer, CssBaseline,  List,Divider, IconButton} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {connect} from "react-redux";
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import InfoPanel from './SidePanel/InfoPanel'



class App extends React.Component {
    state = {
        open: false,
        width: window.innerWidth,
        showbtn: false
    };
    componentDidMount(){
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));


        if(this.state.width > 800){
            this.handleDrawerOpen()

        }else{
            this.handleDrawerClose()
        }
    }


    /**
     * Calculate & Update state of new dimensions
     */
    updateDimensions = () => {
        if(window.innerWidth > 800) {
            this.handleDrawerOpen()

        }else{
            this.handleDrawerClose()
        }

    }



    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }



    handleDrawerOpen = () => {
        if(window.innerWidth > 800) {
            this.setState({open: true, showbtn: false});
        }else{
            this.setState({open: true, showbtn: true});
        }
    }


    handleDrawerClose = () => {
        this.setState({ open: false, showbtn: true });

    };



    render() {
        const {  currentUser, currentChannel,isPrivate,   userPosts, classes } = this.props;
        const { open, showbtn } = this.state;

        return (
            <div className="page">
            <Grid item lg={12} sm={12} xs={12}>
                <Grid container>
                    <div className="drawer_container">
                        <CssBaseline />
                        <Drawer
                            variant="persistent"
                            anchor="left"
                            open={open}
                            className="drawer_override"
                        >
                            <div >
                                {showbtn ?
                                    <IconButton onClick={this.handleDrawerClose}>
                                        <ChevronLeftIcon/>
                                    </IconButton>
                                    : ''
                                }
                            </div>
                            <List  open={open} >
                            <SidePanel
                                open={open}
                                key={currentUser && currentUser.id}
                                currentUser={currentUser}
                            />
                            </List>
                            <Divider />
                        </Drawer>
                    </div>
                    <Grid item lg={6} sm={6} xs={12} style={{position: 'relative'}}>

                       <main>
                            <Messages
                                key={currentChannel && currentChannel.id}
                                handleDrawerOpen={this.handleDrawerOpen}
                                showbtn={showbtn}
                                currentUser={currentUser}
                                currentChannel={currentChannel}
                                isPrivate={isPrivate}
                                userPosts={userPosts}
                            />
                        </main>
                    </Grid>
                    <Grid item lg={3}  sm={3} xs={3}>
                        {isPrivate ? '' :
                            <InfoPanel classes={classes} userPosts={userPosts} isPrivate={isPrivate}
                                       channel={currentChannel}/>
                        }
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
    isPrivate: state.channel.isPrivateChannel,
    userPosts: state.channel.userPosts

});

export default connect(mapStateToProps)(App);
