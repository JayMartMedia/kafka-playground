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
    await fetch('/order', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    });
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