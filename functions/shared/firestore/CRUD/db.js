// uncomment this while production
var env = require('../../environment/env')
var admin = require('../../environment/initAdmin').setCredentials()
const firestore = admin.firestore()
firestore.settings(env.FIRESTORE_SETTINGS)
// const settings = {timestampsInSnapshots: true}
// this function relates to oncreateStore trigger won't work on other
function GetUserEmailByUUID(uid) {
    return firestore
        .collection('users')
        .where('uid', '==', `${uid}`)
        .get()
        .then(docs => {
            let promises = []
            docs
                .forEach(doc => {
                    if (doc.exists) {
                        promises.push(doc.data())
                    }
                })
            return Promise.all(promises)
        })
        .then(array => array[0])
        .then((doc) => doc.email)
}

function AssociateStoreInfoToUser(uid, storeId) {
    let docRef = firestore
        .collection('users')
        .where('uid', '==', `${uid}`)

    return firestore.runTransaction(t => {
        return t.get(docRef)
            .then(docs => {
                let promises = []
                docs.forEach(doc => {
                    if (doc.exists) {
                        promises.push(doc.data())
                    }
                })
                return Promise.all(promises)
            })
            .then(array => array[0])
            .then(userDoc => {
                let registeredStores = (userDoc.registerOf == null) ? [] : userDoc.registerOf
                let storeArray = MergeAndRemoveDuplicatesArray(registeredStores, storeId)
                let dataToUpdate = ((userDoc.isRegister == null) ? false : userDoc.isRegister) ? {
                    registerOf: storeArray
                } : {
                    isRegister: true,
                    registerOf: storeArray,
                    role: 'Register'
                }

                let userDocRef = firestore.doc(`users/${userDoc.email}`)
                t.update(userDocRef, dataToUpdate)
                let StorePropertyObj = {
                    verificationStatus: 'pending',
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                }
                let StoreDOcRef = firestore.doc(`stores/${storeId}`)
                t.update(StoreDOcRef, StorePropertyObj)
                return userDoc.email
            })
    })
}

function MergeAndRemoveDuplicatesArray(array, string) {
    var c = array.concat(string)
    return c.filter(function (item, pos) {
        return c.indexOf(item) === pos
    })
}

function SetInvoicePendingStatusToFalse(invoiceId) {
    return setInvoicePendingStatus(invoiceId, 'false')
}

function updateInvoicePendingStatus(invoiceId, UPDATE_STATUS_BOOLEAN) {
    return firestore
        .doc(`/invoices/${invoiceId}`)
        .update({
            pending: `${UPDATE_STATUS_BOOLEAN}`,
            updatedOn: admin.firestore.FieldValue.serverTimestamp()
        })
}

function setInvoicePendingStatus(invoiceId, UPDATE_STATUS_BOOLEAN) {
    return firestore
        .doc(`/invoices/${invoiceId}`)
        .update({
            pending: `${UPDATE_STATUS_BOOLEAN}`,
            createdOn: admin.firestore.FieldValue.serverTimestamp()
        })
}

function SetProductPRN(productId, PRN_VALUE) {
    return firestore
        .doc(`/products/${productId}`)
        .update({
            prn: PRN_VALUE,
            createdOn: admin.firestore.FieldValue.serverTimestamp()
        })
}

function RandomPRNgenerator() {
    let Length = 5
    var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
    var temp = ''
    for (var i = 0; i < Length; i++) {
        temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length))
    }
    temp = temp.split('').sort(function () {
        return 0.5 - Math.random()
    }).join('')
    return temp
}

function prnCheckLoop() {
    let PRN_VALUE_TO_TEST = RandomPRNgenerator()
    return new Promise(function (resolve) {
        firestore
            .collection(`products`)
            .where('prn', '==', `${PRN_VALUE_TO_TEST}`)
            .get()
            .then(queryResult => resolve((queryResult.empty) ? (PRN_VALUE_TO_TEST) : (prnCheckLoop())))
    })
}

function LocalInventoryProductReturner(storeId, cartProducts) {
    let promises = []
    for (let index = 0; index < cartProducts.length; index++) {
        const cartProduct = cartProducts[index]
        let prn = cartProduct.prn
        let size = cartProduct.size
        let singleUnitPrize = cartProduct.singleUnitPrice
        let quantityToReturn = cartProduct.totalQuantity
        promises.push(ReturnProductQuantity(storeId, prn, size, singleUnitPrize, quantityToReturn))
    }
    return Promise.all(promises)
}

function ReturnProductQuantity(storeId, prn, size, singleUnitPrice, quantityToReturn) {
    let productDocRef = firestore
        .collection(`products`)
        .where('prn', '==', `${prn}`)
        .where('storeId', '==', `${storeId}`)
    return firestore
        .runTransaction(transaction => {
            return transaction
                .get(productDocRef)
                .then((docs) => {
                    return docs
                        .forEach(doc => {
                            let variants = doc.data().variants
                            let returnedVariants = returnStock(variants, singleUnitPrice, size, quantityToReturn)
                            return transaction.update(doc.ref, {variants: returnedVariants})
                        })
                })
        })
}

function returnStock(variants, price, size, quantityToReturn) {
    for (var i = 0; i < variants.length; i++) {
        if (variants[i].sellingPrice == price && variants[i].size === size) { // leave == since it compares two numbers
            variants[i].stock += quantityToReturn
            return variants
        }
    }
    return null
}

function LocalInventoryProductReducer(storeId, cartProducts) {
    let promises = []
    for (let index = 0; index < cartProducts.length; index++) {
        const cartProduct = cartProducts[index]
        let prn = cartProduct.prn
        let size = cartProduct.size
        let singleUnitPrize = cartProduct.singleUnitPrice
        let quantityToReduce = cartProduct.totalQuantity
        promises.push(ReduceProductQuantity(storeId, prn, size, singleUnitPrize, quantityToReduce))
    }
    return Promise.all(promises)
}

function ReduceProductQuantity(storeId, prn, size, singleUnitPrice, quantityToReduce) {
    let productDocRef = firestore
        .collection(`products`)
        .where('prn', '==', `${prn}`)
        .where('storeId', '==', `${storeId}`)
    return firestore
        .runTransaction(transaction => {
            return transaction
                .get(productDocRef)
                .then((docs) => {
                    return docs
                        .forEach(doc => {
                            let variants = doc.data().variants
                            let reducedVariants = reduceStock(variants, singleUnitPrice, size, quantityToReduce)
                            return transaction.update(doc.ref, {variants: reducedVariants})
                        })
                })
        })
}

function reduceStock(variants, price, size, quantityToReduce) {
    for (var i = 0; i < variants.length; i++) {
        if (variants[i].sellingPrice == price && variants[i].size === size) { // leave == since it compares two numbers
            variants[i].stock -= quantityToReduce
            return variants
        }
    }
    return null
}

// customer reward management

function updateCustomerReward(customer) {
    if (checkWhetherCustomerExitOrNot(customer.customerNo)) {
        return createCustomerAndReward(customer)
    } else {
        setAndUpdateCustomerRewards(calculatedCustomerReward(customer))
        if (checkWhetherCustomerNewStoreRewardOrNot(customer.storeId, customer.customerNo)) {
            return createNewStoreCustomerReward(customer)
        } else {
            return setAndUpdateCustomerStoreRewards(calculatedCustomerStoreReward(customer))
        }
    }
}

function checkWhetherCustomerExitOrNot(customerNo) {
    return firestore
        .doc(`customers/${customerNo}`)
        .get()
        .then((customer) => customer.exists)
}


function createCustomerAndReward(customer) {
    const data = {
        'customerName': customer.customerName,
        'noOfItemsPurchased': customer.totalQuantity,
        'totalCostOfPurchase': customer.totalPrice,
        'firstVisit': customer.createdOn,
        'totalNoOfVisit': 1,
        'totalProductsReturn': 0,
    }
    return firestore
        .doc(`customers/${customerNo}`)
        .set(data)
        .then(() => createNewStoreCustomerReward(customer))
}

function calculatedCustomerReward(exitingCustomerData) {
    const currentStateOfCustomerReward = getCurrentStateOfCustomer(exitingCustomerData.customerNo)
    return {
        'customerNo': exitingCustomerData.customerNo,
        'noOfItemsPurchased': currentStateOfCustomerReward.noOfItemsPurchased + exitingCustomerData.totalQuantity,
        'totalCostOfPurchase': currentStateOfCustomerReward.totalCostOfPurchase + exitingCustomerData.totalPrice,
        'totalNoOfVisit': currentStateOfCustomerReward.totalNoOfVisit + 1,
        'lastVisit': exitingCustomerData.createdOn
    }
}

function getCurrentStateOfCustomer(customerNo) {
    return firestore
        .doc(`customers/${customerNo}`)
        .get()
        .then((customer) => customer.data())
}

function setAndUpdateCustomerRewards({customerNo, noOfItemsPurchased, totalCostOfPurchase, totalNoOfVisit, lastVisit}) {
    const data = {
        'noOfItemsPurchased': noOfItemsPurchased,
        'totalCostOfPurchase': totalCostOfPurchase,
        'totalNoOfVisit': totalNoOfVisit,
        'lastVisit': lastVisit
    }
    return firestore
        .doc(`customers/${customerNo}`)
        .set(data, {merge: true})
}

// store reward function

function checkWhetherCustomerNewStoreRewardOrNot(storeId, customerNo) {
    return firestore
        .doc(`stores/${storeId}/customers/${customerNo}`)
        .get()
        .then((store) => store.exists)
}

function createNewStoreCustomerReward(customer) {
    const rewardData = {
        'noOfItemsPurchased': customer.totalQuantity,
        'totalCostOfPurchase': customer.totalPrice,
        'firstVisit': customer.createdOn,
        'totalNoOfVisit': 1,
    }
    return firestore
        .doc(`stores/${customer.storeId}/customers/${customer.customerNo}`)
        .set(rewardData)
}


function calculatedCustomerStoreReward(exitingCustomerData) {
    const currentStateOfCustomerReward = getCurrentStateOfCustomerStoreReward(exitingCustomerData.storeId, exitingCustomerData.customerNo)
    return {
        'customerNo': exitingCustomerData.customerNo,
        'noOfItemsPurchased': currentStateOfCustomerReward.noOfItemsPurchased + exitingCustomerData.totalQuantity,
        'totalCostOfPurchase': currentStateOfCustomerReward.totalCostOfPurchase + exitingCustomerData.totalPrice,
        'totalNoOfVisit': currentStateOfCustomerReward.totalNoOfVisit + 1,
        'lastVisit': exitingCustomerData.createdOn
    }
}


function getCurrentStateOfCustomerStoreReward(storeId, customerNo) {
    return firestore
        .doc(`stores/${storeId}/customers/${customerNo}`)
        .get()
        .then((customer) => customer.data())
}

function updateAndMergeReturnCountInReward(customerNo, totalReturn) {
    const currentReturnState = getCurrentStateOfCustomer(customerNo)
    return firestore
        .doc(`customers/${customerNo}`)
        .set({'totalProductsReturn': currentReturnState + totalReturn}, {merge: true})
}

function setAndUpdateCustomerStoreRewards({storeId, customerNo, noOfItemsPurchased, totalCostOfPurchase, totalNoOfVisit, lastVisit}) {
    const data = {
        'noOfItemsPurchased': noOfItemsPurchased,
        'totalCostOfPurchase': totalCostOfPurchase,
        'totalNoOfVisit': totalNoOfVisit,
        'lastVisit': lastVisit
    }
    return firestore
        .doc(`stores/${storeId}/customers/${customerNo}`)
        .set(data, {merge: true})
}


// integrations related db functions

function saveFlipkartAccessTokenCredentials(storeId, clientId, clientSecret, accessToken) {
    let obj = {
        accessToken: `${accessToken}`,
        appId: `${clientId}`,
        appSecret: `${clientSecret}`
    }
    return firestore
        .doc(`stores/${storeId}/integrations/flipkart`)
        .update(obj)
}

function LogOnflipkartAccessTokenTrigger(storeId, response) {
    let obj = {
        response: JSON.parse(response),
        event: 'access token request',
        timeStamp: admin.firestore.FieldValue.serverTimestamp()
    }
    return LogOnFlipkartEvents(storeId, obj)
}

function LogOnFlipkartEvents(storeId, logObj) {
    return firestore
        .collection(`stores/${storeId}/integrations/flipkart/logs`)
        .add(logObj)
}

function logonFlipkartCreateListings(storeId, response) {
    let obj = {
        response: JSON.parse(response),
        event: 'create listings request',
        timeStamp: admin.firestore.FieldValue.serverTimestamp()
    }
    return LogOnFlipkartEvents(storeId, obj)
}

function logOnFlipkartUpdateListings(storeId, response) {
    let obj = {
        response: JSON.parse(response),
        event: 'update listings request',
        timeStamp: admin.firestore.FieldValue.serverTimestamp()
    }
    return LogOnFlipkartEvents(storeId, obj)
}

function logOnPriceUpdate(storeId, response) {
    let obj = {
        response: JSON.parse(response),
        event: 'update price request',
        timeStamp: admin.firestore.FieldValue.serverTimestamp()
    }
    return LogOnFlipkartEvents(storeId, obj)
}

function logOnInventoryUpdate(storeId, response) {
    let obj = {
        response: JSON.parse(response),
        event: 'update Inventory request',
        timeStamp: admin.firestore.FieldValue.serverTimestamp()
    }
    return LogOnFlipkartEvents(storeId, obj)
}

function logPaymentAuthVerification(storeId, razorpaySubscriptionId, razorpayPaymentId) {
    let obj = {
        event: 'Auth transaction verified',
        event_details: {
            subscriptionId: razorpaySubscriptionId,
            paymentId: razorpayPaymentId
        }
    }
    return firestore
        .collection(`stores/${storeId}/payments`)
        .add(obj)
}

function saveRazorPayId(storeId, razorPayId) {
    return firestore
        .doc(`stores/${storeId}`)
        .update({
            razorPayPaymentId: razorPayId
        })
}

function GetRazorPayCustomerId(storeId) {
    return firestore
        .doc(`stores/${storeId}`)
        .get()
        .then((docRef) => docRef.data().razorPayPaymentId)
}

// Oncreate return related db operations
function deleteInvoice(invoiceId) {
    return firestore
        .doc(`invoices/${invoiceId}`)
        .delete()
        .catch((err) => console.error(err))
}

function deletePendingBill(storeId, PendingBillId) {
    return firestore
        .doc(`stores/${storeId}/pendingbills/${PendingBillId}`)
        .delete()
}

function updateInvoiceOnProductsReturn(invoiceId, cartProducts) {
    let promises = []
    for (let index = 0; index < cartProducts.length; index++) {
        const cartProduct = cartProducts[index]
        let prn = cartProduct.prn
        let size = cartProduct.size
        let singleUnitPrize = cartProduct.singleUnitPrice
        let quantityToReturn = cartProduct.totalQuantity
        promises.push(ReduceProductQuantityOnInvoice(invoiceId, prn, size, singleUnitPrize, quantityToReturn))
    }
    return Promise.all(promises)
}

function ReduceProductQuantityOnInvoice(invoiceId, prn, size, singleUnitPrize, quantityToReturn) {
    let InvoiceDocRef = firestore
        .doc(`invoices/${invoiceId}`)
    return firestore
        .runTransaction(transaction => {
            return transaction
                .get(InvoiceDocRef)
                .then((doc) => {
                    let cartProductsToUpdate = doc.data().cartProducts
                    for (let index = 0; index < cartProductsToUpdate.length; index++) {
                        const cartProduct = cartProductsToUpdate[index]
                        if (cartProduct.prn === prn && cartProduct.size === size && cartProduct.singleUnitPrice == singleUnitPrize) {
                            cartProduct.totalQuantity -= quantityToReturn
                            if (cartProduct.totalQuantity == 0) {
                                if (index > -1) {
                                    cartProductsToUpdate = cartProductsToUpdate.splice(index, 1)
                                }
                            }
                        }
                    }
                    return transaction.update(doc.ref, {cartProducts: cartProductsToUpdate})
                })
        })
}

function assignRandomPendingBillToken(storeId, pendingBillId) {
    let obj = {
        pendingBillToken: getRndInteger(1, 10000)
    }
    return firestore
        .doc(`store/${storeId}/pendingbills/${pendingBillId}`)
        .update(obj)
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function TimestampOnCreateReturn(storeId, returnId) {
    let obj = {
        createdOn: admin.firestore.FieldValue.serverTimestamp
    }
    return firestore
        .doc(`stores/${storeId}/returns/${returnId}`)
        .update(obj)
}

function TimestampOnUpdatedPendingBill(storeId, pendingBillId) {
    let obj = {
        updatedOn: admin.firestore.FieldValue.serverTimestamp
    }
    return firestore
        .doc(`stores/${storeId}/pendingbills/${pendingBillId}`)
        .update(obj)
}

module.exports = {
    AssociateStoreInfoToUser: AssociateStoreInfoToUser,
    ReduceProductQuantity: ReduceProductQuantity,
    UpdatInvoicePendingStatus: updateInvoicePendingStatus,
    SetInvoicePendingStatusToFalse: SetInvoicePendingStatusToFalse,
    SetProductPRN: SetProductPRN,
    prnCheckLoop: prnCheckLoop,
    RandomPRNgenerator: RandomPRNgenerator,
    LocalInventoryProductReducer: LocalInventoryProductReducer,
    updateCustomerReward: updateCustomerReward,
    updateAndMergeReturnCountInReward: updateAndMergeReturnCountInReward,
    saveFlipkartAccessTokenCredentials: saveFlipkartAccessTokenCredentials,
    LogOnflipkartAccessTokenTrigger: LogOnflipkartAccessTokenTrigger,
    logonFlipkartCreateListings: logonFlipkartCreateListings,
    logOnFlipkartUpdateListings: logOnFlipkartUpdateListings,
    logOnPriceUpdate: logOnPriceUpdate,
    logOnInventoryUpdate: logOnInventoryUpdate,
    logPaymentAuthVerification: logPaymentAuthVerification,
    saveRazorPayId: saveRazorPayId,
    GetRazorPayCustomerId: GetRazorPayCustomerId,
    deleteInvoice: deleteInvoice,
    LocalInventoryProductReturner: LocalInventoryProductReturner,
    updateInvoiceOnProductsReturn: updateInvoiceOnProductsReturn,
    deletePendingBill: deletePendingBill,
    assignRandomPendingBillToken: assignRandomPendingBillToken,
    TimestampOnCreateReturn: TimestampOnCreateReturn,
    TimestampOnUpdatedPendingBill: TimestampOnUpdatedPendingBill,
    GetUserEmailByUUID: GetUserEmailByUUID
}
