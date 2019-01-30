import { Component, createElement, render } from './didact.js';

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

        return createElement(
            'div',
            null,
            createElement('button', { onClick: this.toggle }, show ? 'Hide' : 'Show'),
            show && createElement('div', null, this.props.children[0])
        )
    }
}

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
        return createElement('div', {}, String(this.state.counter));
    }

    componentWillUnmount() {
        console.log('unmounted');
        clearInterval(this.timer);
    }
}

const element = createElement(
    "div",
    { id: "container" },
    createElement("input", { value: "foo", type: "text" }),
    createElement(
        "a",
        { href: "/bar" },
        "bar"
    ),
    createElement(
        "button",
        { onClick: e => alert("Hi") },
        "click me"
    ),
    createElement(
        Toggler,
        null,
        createElement(Clock, null)
    )
);

render(element, document.getElementById('mount'));
