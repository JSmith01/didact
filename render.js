const TEXT_ELEMENT = 'TEXT ELEMENT';

/**
 * @param {object} props 
 * @param {HTMLElement} dom 
 */
function addProps(props, dom) {
    for (const propName in props) {
        if (props.hasOwnProperty(propName)) {
            if (propName.startsWith('on')) {
                const eventType = propName.toLowerCase().substring(2);
                dom.addEventListener(eventType, props[propName]);
            } else {
                dom[propName] = props[propName];
            }
        }
    }
}

/**
 * @param {{ type, props: object }} element 
 * @param {HTMLElement} parentDom 
 */
function render(element, parentDom) {
    const { type, props } = element;
    const { children, ...rest } = props;

    const dom = type === TEXT_ELEMENT 
        ? document.createTextNode('') 
        : document.createElement(type);
    
    addProps(rest, dom);
    const childElements = (children || []).forEach(child => render(child, dom));

    parentDom.appendChild(dom);
}

function createTextElement(value) {
    return createElement(TEXT_ELEMENT, { nodeValue: value });
}

function createElement(type, config, ...args) {
    const children = args
        .filter(c => c != null && c !== false)
        .map(c => c instanceof Object ? c : createTextElement(c))

    return {
        type,
        props: {
            ...config,
            children
        }
    };
}
