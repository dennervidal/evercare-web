import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Home from './components/Home';
import Idosos from './components/Idosos/Idosos';
import CriarIdoso from './components/Idosos/CriarIdoso';
import Remedios from './components/Remedios/Remedios';
import CriarRemedio from './components/Remedios/CriarRemedio';
import Leituras from './components/Leituras/Leituras';
import Login from './components/Login';
import {Router, Route, browserHistory} from 'react-router';
import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Dashboard from './components/Dashboard';

injectTapEventPlugin();

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Login}/>
        <Route path='/home' component={Home}>
            <Route path="/idosos" component={Idosos}/>
            <Route path="/idosos/criar" component={CriarIdoso}/>
            <Route path="/remedios" component={Remedios}/>
            <Route path="/remedios/criar" component={CriarRemedio}/>
            <Route path="/leituras" component={Leituras}/>
            <Route path="/dashboard" component={Dashboard}/>
        </Route>
    </Router>,
    document.getElementById('root'));
registerServiceWorker();
