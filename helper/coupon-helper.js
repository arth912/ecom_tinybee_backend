const { StatusCodes } = require('http-status-codes');
const tinybeedb = require('../dbconnections/db');

exports.addNewCouponCode = async (data, userInfo) => {
    let couponData = await getCouponByCode(data.code, userInfo.id)
    if (couponData) {
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'coupon code already exist'
        }
    }

    const fields = ['coupon_code', 'user_id', 'discount', 'discount_type', 'count', 'expires_at',
        'max_discount', 'min_order_value', 'redeem_items', 'created_at']
    const placeHolder = '?,'.repeat(fields.length).replace(/,$/, '')
    const result = await tinybeedb.query(`INSERT INTO coupons (${fields.join(',')}) VALUES (${placeHolder})`, [
        data.code,
        userInfo.id,
        data.discount || 0,
        data.discountType || 'P',
        data.redeemCount || 1,
        data.expire ? new Date(data.expire) : null,
        data.maxDiscount || null,
        data.minOrderValue || null,
        Array.isArray(data.redeemItems) && data.redeemItems.length > 0 ? data.redeemItems.join(',') : '',
        new Date()
    ])
    return {
        status: StatusCodes.OK,
        message: 'coupon added successfully',
        affectedRows: result[0].affectedRows
    }
}

exports.updateCouponCode = async (data, userInfo) => {
    let existing = await getCouponByCode(data.code, userInfo.id)
    if (!existing) {
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'coupon code does not exist'
        }
    }

    const result = await tinybeedb.query(`UPDATE coupons SET discount=?, discount_type=?, count=?,
    expires_at=?, max_discount=?, min_order_value=?, redeem_items=? WHERE coupon_code=? AND user_id=?`, [
        data.discount || existing.discount,
        data.discountType || existing.discount_type,
        data.redeemCount || existing.count,
        data.expire ? new Date(data.expire) : new Date(data.expres_at),
        data.maxDiscount,
        data.minOrderValue,
        Array.isArray(data.redeemItems) && data.redeemItems.length > 0 ? data.redeemItems.join(',') : existing,
        data.code,
        userInfo.id,
    ])
    return {
        status: StatusCodes.OK,
        message: 'coupon updated successfully',
        affectedRows: result[0].affectedRows
    }
}

exports.deleteCouponCode = async (data, userInfo) => {
    let existing = await getCouponByCode(data.code, userInfo.id)
    if (!existing) {
        return {
            status: StatusCodes.BAD_REQUEST,
            message: 'coupon code does not exist'
        }
    }

    const result = await tinybeedb.query(`UPDATE coupons SET is_deleted=1 WHERE coupon_code=? AND user_id=?`, [
        data.code, userInfo.id,
    ])
    return {
        status: StatusCodes.OK,
        message: 'coupon deleted successfully',
        affectedRows: result[0].affectedRows
    }
}

function getCouponByCode(code, userId) {
    let exist = await tinybeedb.query(`SELECT * FROM coupons WHERE coupon_code=? AND user_id=? AND is_deleted=0`, [
        code, userId
    ])
    exist = exist[0]
    return exist[0] || null
}