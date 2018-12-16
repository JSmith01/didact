const TEXT_ELEMENT = 'TEXT ELEMENT';

/**
 * @typedef DidactElement
 * @type {object}
 * @property {string|function} type
 * @property {object} props
 */

/**
 * @typedef DidactInstance
 * @type {object}
 * @property {HTMLElement} dom
 * @property {DidactElement} element
 * @property {DidactInstance[]} childInstances
 * @property {object=} publicInstance
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
 * @param {DidactInstance=} instance 
 * @param {DidactElement} element 
 * @returns {DidactInstance}
 */
function reconcile(parentDom, instance, element) {
    if (instance == null) {
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    }
    
    if (element == null) {
        parentDom.removeChild(instance.dom);
        return null;
    }

    if (instance.element.type === element.type) {
        if (typeof element.type === 'string') {
            updateDomProps(instance.dom, instance.element.props, element.props);
            instance.childInstances = reconcileChildren(instance, element);
            instance.element = element;    
        } else {
            instance.publicInstance.props = element.props;
            const childElement = instance.publicInstance.render();
            const childInstance = reconcile(
                parentDom, 
                (instance.childInstances || {})[0], 
                childElement
            );
            instance.dom = childInstance.dom;
            instance.childInstances = [childInstance];
            instance.element = element;
        }

        return instance;
    } else {
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    }
}

/**
 * @param {DidactInstance} instance 
 * @param {DidactElement} element
 * @returns {DidactInstance[]}
 */
function reconcileChildren(instance, element) {
    const { dom, childInstances } = instance;
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length, nextChildElements.length);
    for (let i = 0; i < count; i++) {
        const childInstance = childInstances[i];
        const childElement = nextChildElements[i];
        const newChildInstance = reconcile(dom, childInstance, childElement);
        newChildInstances.push(newChildInstance);
    }

    return newChildInstances.filter(instance => instance != null);
}

/**
 * @param {DidactElement} element 
 * @returns {DidactInstance}
 */
function instantiate(element) {
    const { type, props } = element;
    const { children, ...domProps } = props;

    if (typeof type === 'string') {
        const dom = type === TEXT_ELEMENT 
            ? document.createTextNode('') 
            : document.createElement(type);
        
        updateDomProps(dom, {}, domProps);
        const childInstances = (children || []).map(instantiate);
        childInstances.forEach(({ dom: childDom }) => dom.appendChild(childDom));

        return { dom, element, childInstances };
    } else {
        const instance = {};
        const publicInstance = createPublicInstance(element, instance);
        const childElement = publicInstance.render();
        const childInstance = instantiate(childElement);

        Object.assign(
            instance, 
            {
                dom: childInstance.dom,
                element,
                childInstances: [childInstance],
                publicInstance
            }
        );
        
        return instance;
    }
}

/**
 * 
 * @param {string} value 
 * @returns {DidactElement}
 */
function createTextElement(value) {
    return createElement(TEXT_ELEMENT, { nodeValue: value });
}

/**
 * 
 * @param {string} type 
 * @param {object} config 
 * @param  {...any} children
 * @returns {DidactElement} 
 */
function createElement(type, config, ...args) {
    const children = args
        .filter(c => c != null && c !== false)
        .map(c => c instanceof Object ? c : createTextElement(c))

    return {
        type,
        props: {
            ...config,
            children,
        }
    };
}

/**
 * @typedef SetStateCallback
 * @type {callback}
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */

class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
    }

    /**
     * @param {object|SetStateCallback} partialState 
     * @param {function=} callback
     */
    setState(partialState, callback) {
        if (typeof partialState === 'function') {
            this.state = { ...this.state, ...partialState(this.state, this.props) }
        } else {
            this.state = { ...this.state, ...partialState };
        }

        updateInstance(this.__internalInstance);

        if (callback) {
            callback();
        }
    }

    /**
     * @returns {DidactElement=}
     */
    render() {
        throw new Error('Component render shall be defined');
    }
}

/**
 * @param {DidactElement} element 
 * @param {DidactInstance} internalInstance
 * @returns {object}
 */
function createPublicInstance(element, internalInstance) {
    const { type, props } = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;

    return publicInstance;
}

/**
 * @param {DidactInstance} instance 
 */
function updateInstance(instance) {
    reconcile(
        instance.dom.parentNode, 
        instance, 
        instance.element
    );
}