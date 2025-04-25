// const axios = require('axios')
import axios from "axios";

const zaloPayment = async (data) => {
  const result = await axios.post(
    `${process.env.REACT_APP_API_URL}/payment/zalo-payment`,
    data
  );
  console.log("data tu payment:", result);
  return result;
};

const zaloPaymentServices = { zaloPayment };

export default zaloPaymentServices;
