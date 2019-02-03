import Didact, { Component } from '../didact/index.js';
import Toggler from './Toggler.js';
import Clock from './Clock.js';

class App extends Component {
    clickHandler() {
        alert('Hi');
    }

    render() {
        return <div id="container">
            <input value="foo" type="text"/>
            <a href="/bar">bar</a>
            <button onClick={this.clickHandler}>clickMe</button>
            <Toggler><Clock /></Toggler>
        </div>;
    }
}

export default App;
