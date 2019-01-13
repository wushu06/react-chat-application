import React from 'react';
import {Link} from 'react-router-dom';
import { SnackbarContent,  Grid, Button, FormControl, FormControlLabel, Checkbox, Input, InputLabel} from '@material-ui/core';
import firebase from '../../firebase';
import md5 from 'md5';
import logo from '../../logo.svg'

class Register extends React.Component {
    state = {
        username : '',
        email: '',
        password: '',
        passwordConfirmation: '',
        loading: false,
        errors: [],
        userRef: firebase.database().ref('users')

    }
    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    }
    handleSubmit = event => {
        event.preventDefault();
        let errors = [];

        this.setState({loading: true, errors: []})
        if(!this.isFormEmpty()) {
            this.setState({loading: false, errors: errors.concat({message: 'Please fill the form.'}) })


        }else if(!this.isPasswordValid()){
            this.setState({loading: false, errors: errors.concat({message: 'Passwords not matching or too short.'}) });


        }else{
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    this.setState({
                        loading: false
                    });
                    createdUser.user
                        .updateProfile({
                            displayName: this.state.username,
                            photoURL: `http://gravatar.com/avatar/${md5(
                                createdUser.user.email
                            )}?d=identicon`
                        })
                        .then(() => {
                            this.saveUser(createdUser)
                        })
                        .catch(err => {
                            console.error(err);

                        });
                })
                .catch(err=> {
                    this.setState({loading: false, errors: errors.concat({message: 'Something went wrong, Please contact the team.'})})
                })
        }


    };

    saveUser = createdUser => {
        this.state.userRef
            .child(createdUser.user.uid)
            .set({
                name: createdUser.user.displayName,
                avatar: createdUser.user.photoURL
            })
    }
    isPasswordValid = () => {
        const { password, passwordConfirmation, errors} = this.state
        return password === passwordConfirmation && password >= 6

    }
    isFormEmpty = () => {
        const {username, email, password, passwordConfirmation, errors} = this.state
        if(username === '' || email === '' || password === '' || passwordConfirmation === ''){
            return false;
        }else  {
            return true;
        }
    }

    handleInputError = (errors, inputName) => {
       errors.some(error => {
           console.log(error);
           // error.message.toLowerCase().includes(inputName) ? 'error' : '';
        })
    }

    render() {
        const {passwordConfirmation,loading, errors} = this.state;
        return (
            <div>
                <main className="app-form">
                    <Grid container spacing={24} center="true">
                        <Grid item xs={12}>
                            <div style={{textAlign : 'center', width: '100%'}}>
                                <img src={logo} alt="" width={80}/>
                            </div>

                            <h2 style={{textAlign: 'center'}} >Register</h2>
                            <form style={{margin: 'auto'}} >
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="username">Username</InputLabel>
                                    <Input
                                        onChange={this.handleChange}
                                        id="username" name="username" autoComplete="username" autoFocus />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">Email Address</InputLabel>
                                    <Input
                                        onChange={this.handleChange}
                                        id="email" name="email" autoComplete="email" autoFocus />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input
                                        onChange={this.handleChange}
                                        name="password" type="password" id="password" autoComplete="current-password" />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="passwordConfirmation">Password Confirmation</InputLabel>
                                    <Input
                                        onChange={this.handleChange}
                                        name="passwordConfirmation" type="password" id="passwordConfirmation" autoComplete="current-password" />
                                </FormControl>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <br/>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    disabled={loading}

                                >
                                    Register
                                </Button>
                            </form>
                            <div>
                                {errors.length > 0 &&
                                  errors.map((error, key)=> {
                                      return (
                                          <div key={key} style={{marginTop: '30px'}}>
                                          < SnackbarContent
                                              className="msg_error"
                                            color="error"
                                              message={error.message}

                                          />

                                          </div>

                                          )
                                  })  }

                            </div>
                            <div style={{marginTop: '30px'}}>
                               Already have an account? {' '}
                                <Link to="/login">Login</Link>
                            </div>

                        </Grid>
                    </Grid>

                </main>

            </div>
        )
    }
}

export default Register;