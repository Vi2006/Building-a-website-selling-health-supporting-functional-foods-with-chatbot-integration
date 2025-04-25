import React, { useState } from "react";
import {
  CheckoutContainer,
  Title,
  CheckoutForm,
  FormGroup,
  Label,
  Input,
  OrderButton,
} from "./style";
import { useSelector } from "react-redux";
import orderServices from "../../services/OrderService";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useDispatch } from "react-redux";
import {
  updateProductArr,
  updateSelected,
} from "../../redux/Slides/orderSlide";

export const CheckOut = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log("User", user.id);
  const selected = order.selected;
  let arr = [];
  let totalPrice = 0;
  selected.forEach((element) => {
    arr.push(order.orderItems[element]);
    totalPrice =
      totalPrice +
      order.orderItems[element]?.price * order.orderItems[element]?.amount;
  });

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(0|\+84)[35789][0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // const handleSubmit = async (event) => {
  //   console.log("Arrr", arr);
  //   event.preventDefault();
  //   const res = await orderServices.createOrder({
  //     orderItems: arr,
  //     totalPrice,
  //     shippingAddress: formData,
  //     user: user.id,
  //   });
  //   console.log("Res", res);
  //   const newArr = order.orderItems.filter(
  //     (item, index) => !selected.includes(index)
  //   );
  //   dispatch(updateProductArr(newArr));
  //   dispatch(updateSelected([]));
  //   navigate("/order");
  // };

  const handleSubmit = async (event) => {
    console.log("Arrr", arr);
    event.preventDefault();
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(formData?.email)) {
      message.error("Email không hợp lệ, vui lòng nhập lại");
      return;
    }
    if (!formData.fullName) {
      message.warning("Vui lòng điền họ tên");
      return;
    }
    if (!formData.address) {
      message.warning("Vui lòng nhập thông tin địa chỉ");
      return;
    }
    if (!formData.email) {
      message.warning("Email không hợp lệ vui lòng nhập lại");
      return;
    }
    if (!validatePhoneNumber(formData?.phone)) {
      message.warning("Vui lòng nhập số điện thoại hợp lệ ");
      return;
    }
    try {
      const res = await orderServices.createOrder({
        orderItems: arr,
        totalPrice,
        shippingAddress: formData,
        user: user.id,
      });

      console.log("Res", res);

      // 🔔 Hiển thị thông báo đặt hàng thành công
      message.success("🎉 Đặt hàng thành công!", 2); // Hiển thị 2 giây

      // Cập nhật Redux store
      const newArr = order.orderItems.filter(
        (item, index) => !selected.includes(index)
      );
      dispatch(updateProductArr(newArr));
      dispatch(updateSelected([]));

      // ⏳ Chờ 2 giây rồi chuyển hướng
      setTimeout(() => navigate("/order"), 2000);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      message.error(" Đặt hàng thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginRight: "0px",
        margin: "0px auto",
        width: "100vw",
      }}
    >
      <CheckoutContainer>
        <table className="table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Image</th>
              <th>Đơn giá</th>
            </tr>
          </thead>
          <tbody className="">
            {order?.selected?.length &&
              order?.selected?.map((item, index) => (
                <tr key={index}>
                  <td style={{ color: "red" }}>
                    {order.orderItems[item]?.name}
                  </td>
                  <td style={{ color: "red" }}>
                    {order.orderItems[item]?.amount}
                  </td>
                  <td>
                    {
                      <img
                        src={order.orderItems[item]?.image}
                        alt=""
                        style={{ width: "50px" }}
                      ></img>
                    }
                  </td>
                  <td style={{ color: "red" }}>
                    {order.orderItems[item]?.price
                      ? (
                          order.orderItems[item]?.price *
                          (1 - (order.orderItems[item]?.discount || 0) / 100)
                        ).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "0 VND"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <CheckoutForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="fullName" style={{ fontSize: "15px" }}>
              Họ và tên:
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="address" style={{ fontSize: "15px" }}>
              Địa chỉ:
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email" style={{ fontSize: "15px" }}>
              Email:
            </Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone" style={{ fontSize: "15px" }}>
              Số điện thoại:
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormGroup>
          <OrderButton type="submit" style={{ fontSize: "15px" }}>
            Đặt hàng
          </OrderButton>
        </CheckoutForm>
      </CheckoutContainer>
    </div>
  );
};
