/** PUBLIC **/
async function handleFormSubmit (e) {
    e.preventDefault();

    const customerId = getCustomerId();
    const item = getItem();
    // const orderId = getOrderId();
    const order = {
        customerId,
        item,
        // orderId
    }
    const res = await fetch('/order', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    });

    if(res.ok){
        clearItem();
        const createdOrder = await res.json();
        displaySuccess(createdOrder);
    } else {
        displayFailure(order);
    }
}

/** Private **/

/**
 * @returns {string} the current value of the customerId input element
 */
function getCustomerId () {
    return document.getElementById('customerId').value;
}

/**
 * @returns {void}
 */
function clearCustomerId () {
    document.getElementById('customerId').value = '';
}

/**
 * @returns {string} the current value of the item input element
 */
function getItem () {
    return document.getElementById('item').value;
}

/**
 * @returns {void}
 */
 function clearItem () {
    document.getElementById('item').value = '';
}

// /**
//  * @returns {string} the current value of the orderId input element
//  */
// function getOrderId () {
//     return document.getElementById('orderId').value;
// }

// /**
//  * @returns {void}
//  */
// function clearOrderId () {
//     document.getElementById('orderId').value = '';
// }

function displaySuccess(order) {
    const successfulNotification = document.getElementById('success-notification');
    successfulNotification.getElementsByTagName('pre')[0].innerText = JSON.stringify(order, null, 2);
    successfulNotification.style.display = 'block';
    setTimeout(clearSuccess, 5000);
}

function clearSuccess() {
    const successfulNotification = document.getElementById('success-notification');
    successfulNotification.style.display = 'none';
    successfulNotification.getElementsByTagName('pre').innerText = '';
}

function displayFailure(order) {
    const failureNotification = document.getElementById('failure-notification');
    failureNotification.getElementsByTagName('pre')[0].innerText = JSON.stringify(order, null, 2);
    failureNotification.style.display = 'block';
    setTimeout(clearFailure, 5000);
}

function clearFailure() {
    const failureNotification = document.getElementById('failure-notification');
    failureNotification.style.display = 'none';
    failureNotification.getElementsByTagName('pre').innerText = '';
}