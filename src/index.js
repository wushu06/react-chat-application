import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { BrowserRouter as Router , Route,  Switch, withRouter} from 'react-router-dom';
import './App.css';
import firebase from './firebase';
import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {setUser, clearUser} from './actions';
import {Provider, connect} from 'react-redux';
import Spinner from './Spinner';


/*
 * to set global state you need store & provider
 * the store to set the global state
 *
 * now we need to connect
 * the provider the provide the state to all our components thats why we wrap everything under Provider
 * action: we pass to the function inside it the user obj so now action has the obj
 * reducer: we pass the action to it and the type and based on the type it returns the obj (state) that we want to use
 * we need action so we can use it to add the global state to props using action function
 */
const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {

    componentDidMount(){
        //console.log(this.props);
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                //we have user obj lets pass it to a global function (action function) which is in props
                // to add action function to props we use connect

                this.props.setUser(user);
                this.props.history.push('/')

            }else{
                this.props.clearUser(user);
                this.props.history.push('/login')
            }
        });
    }
    render() {
        return this.props.isLoading ? <Spinner /> : (

            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>

        )
    }
}

// what you want to use here in this page in this example we only need isLoading
const mapStateFromProps = state => ({
    isLoading: state.user.isLoading,
})

const RootWithAuth = withRouter(connect(mapStateFromProps, {setUser, clearUser} )(Root))

ReactDOM.render(
    <Provider store={store}>

        <Router>
            <RootWithAuth />
        </Router>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
