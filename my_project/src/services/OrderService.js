import axios from "axios";

const createOrder = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/order/create-order`,
    data
  );
  // console.log("res", res);
  return res;
};

const getOrders = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/order/${id}`);
  // console.log("res", res);
  return res;
};

const deleteOrders = async (id) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/order/${id}`
  );
  // console.log("res", res);
  return res;
};

const getAllOrder = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/order/get-all-order`
  );
  console.log("res", res);
  return res;
};

const getOrderGroup = async () => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/order/group`);
  console.log("res", res);
  return res;
};

const duyethoadon = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/order/status/${id}`
  );
  console.log("res", res);
  return res;
};

const duyetthanhtoan = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/order/payment/${id}`
  );
  console.log("res", res);
  return res;
};

const getMoney = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/order/money`,
    data
  );
  console.log("res", res);
  return res;
};

const orderServices = {
  getOrders,
  createOrder,
  deleteOrders,
  getAllOrder,
  getOrderGroup,
  duyethoadon,
  duyetthanhtoan,
  getMoney,
};

export default orderServices;
