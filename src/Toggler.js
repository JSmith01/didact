import Didact, { Component } from '../didact.js';

class Toggler extends Component {
    constructor(props) {
        super(props);
        this.state = { show: true };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(({ show }) => ({ show: !show }));
    }

    render() {
        const { show } = this.state;

        return <div>
            <button onClick={this.toggle}>{show ? 'Hide' : 'Show'}</button>
            <div>{this.props.children[0]}</div>
        </div>;
    }
}

export default Toggler;
