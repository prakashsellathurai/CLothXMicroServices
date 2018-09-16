'use strict';

const errorNotImplemented = require('./index').errorNotImplemented;

const _POST_FULFILLMENT_ORDER_REQUEST_DATA_ = errorNotImplemented('_POST_FULFILLMENT_ORDER_REQUEST_DATA_');
const _POST_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_ = errorNotImplemented('_POST_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_');
const _POST_FBA_INBOUND_CARTON_CONTENTS_ = errorNotImplemented('_POST_FBA_INBOUND_CARTON_CONTENTS_');
const _POST_FLAT_FILE_FULFILLMENT_ORDER_REQUEST_DATA_ = errorNotImplemented('_POST_FLAT_FILE_FULFILLMENT_ORDER_REQUEST_DATA_');
const _POST_FLAT_FILE_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_ = errorNotImplemented('_POST_FLAT_FILE_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_');
const _POST_FLAT_FILE_FBA_CREATE_INBOUND_PLAN_ = errorNotImplemented('_POST_FLAT_FILE_FBA_CREATE_INBOUND_PLAN_');
const _POST_FLAT_FILE_FBA_UPDATE_INBOUND_PLAN_ = errorNotImplemented('_POST_FLAT_FILE_FBA_UPDATE_INBOUND_PLAN_');
const _POST_FLAT_FILE_FBA_CREATE_REMOVAL_ = errorNotImplemented('_POST_FLAT_FILE_FBA_CREATE_REMOVAL_');

module.exports = {
    _POST_FULFILLMENT_ORDER_REQUEST_DATA_,
    _POST_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_,
    _POST_FBA_INBOUND_CARTON_CONTENTS_,
    _POST_FLAT_FILE_FULFILLMENT_ORDER_REQUEST_DATA_,
    _POST_FLAT_FILE_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA_,
    _POST_FLAT_FILE_FBA_CREATE_INBOUND_PLAN_,
    _POST_FLAT_FILE_FBA_UPDATE_INBOUND_PLAN_,
    _POST_FLAT_FILE_FBA_CREATE_REMOVAL_
};
