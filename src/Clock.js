import Didact, { Component } from '../didact.js';

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = { counter: 0 };
        this.timer = setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        this.setState(({ counter }) => ({ counter: counter + 1 }));
    }

    render() {
        return <div>{String(this.state.counter)}</div>;
    }

    componentWillUnmount() {
        console.log('unmounted');
        clearInterval(this.timer);
    }
}

export default Clock;
