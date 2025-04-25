import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrderProduct,
  removeOrderProduct,
  updateSelected,
} from "../../redux/Slides/orderSlide";
import { WrapperCart } from "./style";
import { useNavigate } from "react-router-dom";
import orderServices from "../../services/OrderService";
import zaloPaymentServices from "../../services/PaymentService";

// import ActionEdit from "./ActionEdit";
function formatCurrency(number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(number);
}

const OrderPage = () => {
  const phiGiaoHang = 10000;
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [total, setTotal] = useState("null");
  const [giamGia, setGiamGia] = useState("null");
  const [penDing, setPending] = useState(false);
  const [mang, setMang] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    if (user?.id) {
      const fetchOrder = async (id) => {
        const res = await orderServices.getOrders(id);
        console.log("resOrder", res);
        setOrderList(res.data.data);
      };
      fetchOrder(user.id);
    }
  }, [user?.id, penDing]);

  useEffect(() => {
    console.log("order", order.orderItems);
    let tam = 0;
    let giam = 0;
    mang?.forEach((element) => {
      const orderItem = order.orderItems[element];
      if (orderItem) {
        // Kiểm tra nếu orderItem tồn tại
        giam += (orderItem.price * orderItem.amount * orderItem.discount) / 100;
        tam += orderItem.price * orderItem.amount;
      }
    });

    setGiamGia(giam);
    setTotal(tam);
  }, [mang, order.orderItems]);

  const handleChane = (index) => {};

  const handleGiam = (index) => {
    // order?.orderItems[index].amount =
    dispatch(
      addOrderProduct({
        orderItem: {
          product: order.orderItems[index].product,
          amount: order.orderItems[index].amount >= 2 ? -1 : 0,
        },
      })
    );
  };

  const handleCheckout = () => {
    if (mang.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
      return;
    }
    navigate("/check-out");
  };

  const handleSelect = (index) => {
    if (mang?.includes(index)) {
      let newArr = mang.filter((item) => item !== index);
      setMang(newArr);
      dispatch(updateSelected(newArr));
    } else {
      setMang([...mang, index]);
      dispatch(updateSelected([...mang, index]));
    }
  };

  const handleTang = (index) => {
    dispatch(
      addOrderProduct({
        orderItem: {
          product: order.orderItems[index].product,
          amount: 1,
        },
      })
    );
  };

  const handleXoa = (index) => {
    dispatch(removeOrderProduct(index));
    message.success("Xóa sản phẩm thành công");
  };

  const handleXoaDonHang = async (id) => {
    const res = await orderServices.deleteOrders(id);
    setPending(!penDing);
    message.success("Xóa sản phẩm thành công");
    console.log("Ress", res);
    return res;
  };

  const handlePayment = async (item) => {
    const { _id, totalPrice } = item;
    console.log("hevfhebfnr", item);
    const res = await zaloPaymentServices.zaloPayment({ _id, totalPrice });

    console.log("res o frontend", res.data);
    if (res.data.order_url) {
      window.location.href = res.data.order_url;
    }
  };

  return (
    <div className="">
      <div className="">
        <table className="table">
          <thead>
            <tr>
              <th>Chọn</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Image</th>
              <th>Đơn giá</th>

              <th>
                <div className="">Hành động</div>
              </th>
            </tr>
          </thead>
          <tbody className="">
            {order?.orderItems?.length > 0 ? (
              order?.orderItems?.map(
                (item, index) =>
                  item ? ( // Kiểm tra item có tồn tại hay không
                    <tr key={index}>
                      <td>
                        <input
                          // style={{ color: "red" }}
                          type="checkbox"
                          onChange={() => handleSelect(index)}
                        ></input>
                      </td>
                      <td style={{ color: "red" }}>
                        {item?.name || "Không có tên"}
                      </td>
                      <td style={{ color: "red" }}>{item?.amount || 0}</td>
                      <td style={{ color: "red" }}>
                        {item?.image ? (
                          <img
                            src={item.image}
                            alt=""
                            style={{ width: "50px" }}
                          />
                        ) : (
                          "Không có ảnh"
                        )}
                      </td>
                      <td style={{ color: "red" }}>
                        {item?.price
                          ? formatCurrency(
                              item?.price * (1 - item?.discount / 100)
                            )
                          : "0 VND"}
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <Button onClick={() => handleGiam(index)}>-</Button>
                          <Button onClick={() => handleTang(index)}>+</Button>
                          <Button
                            onClick={() => handleXoa(index)}
                            type="text"
                            danger
                            icon={
                              <DeleteOutlined
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                }}
                              />
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ) : null // Nếu item là undefined, không hiển thị gì cả
              )
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    color: "red",
                    // backgroundColor: "lightyellow",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Không có sản phẩm nào trong giỏ hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <WrapperCart>
        <h2 className="">Tóm tắt đơn hàng</h2>

        <div className="row">
          <h3 className="">Phí giao hàng:</h3>
          <span className="red-text">{formatCurrency(phiGiaoHang)}</span>
        </div>

        <div className="row total">
          <h3 className="">Tổng tiền:</h3>
          <span className="red-text">
            {total > 0 ? formatCurrency(total - giamGia + phiGiaoHang) : ""}
          </span>
        </div>

        <button className="order-button" onClick={handleCheckout}>
          Mua hàng
        </button>
      </WrapperCart>
      <div style={{ marginTop: "10px" }}>
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã hóa đơn</th>
              <th>Số lượng đơn hàng</th>
              <th>Tên người nhận</th>
              <th>Tổng tiền</th>
              <th>Trạng thái hóa đơn</th>

              <th>
                <div className="">Hành động</div>
              </th>
            </tr>
          </thead>
          <tbody className="">
            {orderList?.length > 0 ? (
              orderList?.map(
                (item, index) =>
                  item ? (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?._id || "Không có tên"}</td>
                      <td>{item?.orderItems?.length}</td>
                      <td>{item?.shippingAddress?.fullName}</td>
                      <td style={{ display: "flex" }}>
                        {item?.totalPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>
                        {item?.isPaid === false ? (
                          <span className="status-unpaid">
                            {" "}
                            chưa thanh toán{" "}
                          </span>
                        ) : (
                          <span className="status-paid"> Đã thanh toán </span>
                        )}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <Button
                            onClick={() => handlePayment(item)}
                            disabled={item.isPaid === true ? true : false}
                          >
                            Thanh toán
                          </Button>
                          <Button
                            onClick={() => handleXoaDonHang(item?._id)}
                            type="text"
                            danger
                            icon={
                              <DeleteOutlined
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                }}
                              />
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ) : null // Nếu item là undefined, không hiển thị gì cả
              )
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    color: "red",
                    // backgroundColor: "lightyellow",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Bạn chưa có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderPage;
