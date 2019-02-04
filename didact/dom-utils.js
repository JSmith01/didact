import { TEXT_ELEMENT } from './constants.js';

const checkUpdateProp = (prev, next) => propName => (
    propName !== 'children' &&
    propName !== 'style' &&
    prev[propName] !== next[propName]
);

const isEventListener = propName => propName.startsWith('on');
const getEventType = propName => propName.toLowerCase().substring(2);

/**
 * @param {HTMLElement} dom
 * @param {object} prevProps
 * @param {object} nextProps
 */
export function updateDomProps(dom, prevProps, nextProps) {
    const removeCheck = checkUpdateProp(prevProps, nextProps);
    const addCheck = checkUpdateProp(nextProps, prevProps);

    for (const propName in prevProps) {
        if (removeCheck(propName)) {
            if (isEventListener(propName)) {
                dom.removeEventListener(getEventType(propName), prevProps[propName]);
            } else {
                dom[propName] = null;
            }
        }
    }

    for (const propName in nextProps) {
        if (addCheck(propName)) {
            if (isEventListener(propName)) {
                dom.addEventListener(getEventType(propName), nextProps[propName]);
            } else {
                dom[propName] = nextProps[propName];
            }
        }
    }
}

/**
 * @param {object} fiber
 * @param {string} fiber.type
 * @param {object} fiber.props
 * @returns {Text|HTMLElement}
 */
export function createDomElement(fiber) {
    const dom =
        fiber.type === TEXT_ELEMENT
            ? document.createTextNode('')
            : document.createElement(fiber.type);

    updateDomProps(dom, {}, fiber.props);

    return dom;
}
