const formidable = require("formidable");
const express = require("express");
const {
  transactionOfOrderGroupCompleted,
} = require("../../Services/OrdersGroupService");
const PaytmChecksum = require("../../Services/PaytmChecksum");

const router = express.Router();

router.post("/paytm/callback", async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, file) => {
    paytmChecksum = fields.CHECKSUMHASH;
    delete fields.CHECKSUMHASH;

    var isVerifySignature = PaytmChecksum.verifySignature(
      fields,
      process.env.PAYTM_MERCHANT_KEY,
      paytmChecksum
    );
    if (isVerifySignature) {
      var paytmParams = {};
      paytmParams["MID"] = fields.MID;
      paytmParams["ORDERID"] = fields.ORDERID;

      /*
       * Generate checksum by parameters we have
       * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
       */
      PaytmChecksum.generateSignature(
        paytmParams,
        process.env.PAYTM_MERCHANT_KEY
      ).then(function (checksum) {
        paytmParams["CHECKSUMHASH"] = checksum;

        var post_data = JSON.stringify(paytmParams);

        var options = {
          /* for Staging */
          hostname: "securegw-stage.paytm.in",

          /* for Production */
          // hostname: 'securegw.paytm.in',

          port: 443,
          path: "/order/status",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });

          post_res.on("end", async function () {
            let result = JSON.parse(response);
            if (result.STATUS === "TXN_SUCCESS") {
              //store in db
              await transactionOfOrderGroupCompleted(result.ORDERID);
            }

            res.redirect(`http://localhost:3000/status/${result.ORDERID}`);
          });
        });

        post_req.write(post_data);
        post_req.end();
      });
    } else {
      console.log("Checksum Mismatched");
    }
  });
});

module.exports = router;
