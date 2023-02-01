const https = require("https");
require("dotenv").config();
const PaytmChecksum = require("./PaytmChecksum");
const { getUserById } = require("./UserService");

const createOrder = async (order) => {
  const user = await getUserById(order.c_id);

  var params = {};

  /* initialize an array */
  (params["MID"] = process.env.PAYTM_MID),
    (params["WEBSITE"] = "default"),
    (params["CHANNEL_ID"] = "WEB"),
    (params["INDUSTRY_TYPE_ID"] = "Retail"),
    (params["ORDER_ID"] = order.orderId.toString()),
    (params["CUST_ID"] = order.c_id.toString()),
    (params["TXN_AMOUNT"] = order.amount.toString()),
    (params[
      "CALLBACK_URL"
    ] = `${process.env.SERVER}/api/payment/paytm/callback`),
    (params["EMAIL"] = user.email),
    (params["MOBILE_NO"] = user.phone.toString());

  console.log(params);

  const checksum = await PaytmChecksum.generateSignature(
    params,
    process.env.PAYTM_MID_KEY
  );

  const paytmParams = {
    ...params,
    CHECKSUMHASH: checksum,
  };

  return paytmParams;
};

module.exports = {
  createOrder,
};
