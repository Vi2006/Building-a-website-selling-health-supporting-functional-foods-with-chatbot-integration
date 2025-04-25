import axios from "axios";

const createThanhly = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/thanhly`,
    data
  );
  // console.log("res", res);
  return res;
};

const getAllThanhly = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/thanhly`);
  // console.log("res", res);
  console.log("Res", res);
  return res;
};

const ThanhlyServices = {
  createThanhly,
  getAllThanhly,
};

export default ThanhlyServices;
