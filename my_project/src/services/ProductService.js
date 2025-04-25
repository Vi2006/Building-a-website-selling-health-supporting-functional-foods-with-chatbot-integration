import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async (
  search = "",
  limit = null,
  type,
  expiredDate
) => {
  let res = {};
  // if (search?.length > 0) {
  res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`, {
    params: {
      filter: "name",
      search: search,
      limit: limit,
      type: type, // Nếu là mảng, axios sẽ tự chuyển thành: type=shoes&type=bags
      expiredDate: expiredDate,
    },
  });
  console.log("Ress", res);
  // } else {
  // res = await axios.get(
  //   `${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}`
  // );
  // }
  return res;
};

export const getProductType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create`,
    data
  );
  return res.data;
};

export const thongKe = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/thongke`
  );
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-details/${id}`
  );
  // console.log("res.data", res.data);
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/product/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/product/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyProduct = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/product/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all-type`
  );
  console.log("resss", res);
  return res.data;
};
