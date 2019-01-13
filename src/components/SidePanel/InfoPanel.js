import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Icon,Avatar,  List,ListItemText,ListItem, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography   } from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
    root: {
        width: '100%',
        paddingLeft: '10px'
    },

    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

class InfoPanel extends React.Component {
    state = {
        expanded: null,
        channel : this.props.channel,
        isPrivate: this.props.isPrivate,
        open: true,
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    componentDidMount() {
        this.setState({
            expanded: 'panel1',
        });
    }

    formatCount = num => (num > 1 || num === 0 ? `${num} posts` : `${num} post`);
    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });

    };

    displayTopPosters = posts =>
        Object.entries(posts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, val], i) => (
                <List key={i}>
                    <ListItem>
                    <Avatar src={val.avatar} />
                        <ListItemText primary={key} secondary={
                            this.formatCount(val.count)
                        }/>

                    </ListItem>
                </List>
            ))
            .slice(0, 2);

    render() {
        const { classes, channel, userPosts, isPrivate } = this.props;
        const { expanded } = this.state;

        return (

            <div className={classes.root} >

                <div style={{padding: '20px'}}>
                    About   <span style={{color: '#3f51b5'}}>@{channel && channel.name}</span>
                </div>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                    <ExpansionPanelSummary className="accordion" expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Info</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <Icon>info_icon</Icon>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                           Details:  {channel && channel.desc}
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                    <ExpansionPanelSummary className="accordion" expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{isPrivate  ? 'Profile' : 'Top posters' }</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <Icon>face_icon</Icon>
                        </Typography>

                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                         <List>{userPosts && this.displayTopPosters(userPosts)}</List>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                {isPrivate  ? '' :
                    <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
                    <ExpansionPanelSummary className="accordion" expandIcon={<ExpandMoreIcon/>}>
                    <Typography className={classes.heading}>Created by</Typography>
                    <Typography className={classes.secondaryHeading}>
                    <Icon>info_icon</Icon>
                    </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    <List >
                    <ListItem>
                    <Avatar src={channel && channel.createdBy.avatar} />
                    <ListItemText primary={channel && channel.createdBy.name} />

                    </ListItem>
                    </List>

                    </ExpansionPanelDetails>
                    </ExpansionPanel>
                }

            </div>

        );
    }
}

InfoPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoPanel);