const TEXT_ELEMENT = 'TEXT ELEMENT';

/**
 * @typedef DidactElement
 * @type {object}
 * @property {*} type
 * @property {object} props
 */

/**
 * @typedef DidactInstance
 * @type {object}
 * @property {HTMLElement} dom
 * @property {DidactElement} element
 * @property {DidactInstance[]} childInstances
 */

/**
 * @param {HTMLElement} dom
 * @param {object} prevProps
 * @param {object} nextProps
 */
function updateDomProps(dom, prevProps, nextProps) {
    for (const propName in prevProps) {
        if (prevProps.hasOwnProperty(propName) && prevProps[propName] !== nextProps[propName]) {
            if (propName.startsWith('on')) {
                const eventType = propName.toLowerCase().substring(2);
                dom.removeEventListener(eventType, prevProps[propName]);
            } else {
                dom[propName] = null;
            }
        }
    }

    for (const propName in nextProps) {
        if (nextProps.hasOwnProperty(propName) && prevProps[propName] !== nextProps[propName]) {
            if (propName.startsWith('on')) {
                const eventType = propName.toLowerCase().substring(2);
                dom.addEventListener(eventType, nextProps[propName]);
            } else {
                dom[propName] = nextProps[propName];
            }
        }
    }
}

let rootInstance = null;

/**
 * @param {DidactElement} element 
 * @param {HTMLElement} container 
 */
function render(element, container) {
    rootInstance = reconcile(container, rootInstance, element);
}

/**
 * @param {HTMLElement} parentDom 
 * @param {DidactInstance=} prevInstance 
 * @param {DidactElement} element 
 * @returns {DidactInstance}
 */
function reconcile(parentDom, prevInstance, element) {
    const newInstance = instantiate(element);
    if (prevInstance === null) {
        parentDom.appendChild(newInstance.dom);
    } else {
        parentDom.replaceChild(newInstance.dom, prevInstance.dom);
    }

    return newInstance;
}

/**
 * @param {DidactElement} element 
 * @returns {DidactInstance}
 */
function instantiate(element) {
    const { type, props } = element;
    const { children, ...domProps } = props;

    const dom = type === TEXT_ELEMENT 
        ? document.createTextNode('') 
        : document.createElement(type);
    
    updateDomProps(dom, {}, domProps);
    const childInstances = (children || []).map(instantiate);
    childInstances.forEach(({ dom: childDom }) => dom.appendChild(childDom));

    return { dom, element, childInstances };
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
