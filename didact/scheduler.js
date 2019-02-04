const ENOUGH_TIME = 1; // milliseconds

const workQueue = [];
let nextUnitOfWork = null;

/**
 * @param {function} task
 */
export function schedule(task) {
    workQueue.push(task);
    window.requestIdleCallback(performWork);
}

/**
 * @param {IdleDeadline} deadline
 */
function performWork(deadline) {
    if (!nextUnitOfWork) {
        nextUnitOfWork = workQueue.shift();
    }

    while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    if (nextUnitOfWork || workQueue.length > 0) {
        requestIdleCallback(performWork);
    }
}

/**
 * @param {function} unitOfWork
 */
function performUnitOfWork(unitOfWork) {

}