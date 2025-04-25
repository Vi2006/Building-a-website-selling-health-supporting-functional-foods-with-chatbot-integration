import React, { useEffect, useState } from "react";
import { WrapperHeaderAdmin } from "./style";
import { Button, Input, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";

// import { Loading } from "../LoadingComponent/Loading";

import { useQuery } from "@tanstack/react-query";

// import * as message from "../../components/Message/Message";
import { useSelector } from "react-redux";
import OrderService from "../../services/OrderService";
import { SearchOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import orderServices from "../../services/OrderService";

function formatCurrency(number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(number);
}

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);
  const [data, setData] = useState([]);
  const COLORS = ["#FF6F61", "#D4A5A5", "#FFBB28", "#FF8042"];
  const data1 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  useEffect(() => {
    const fetchOrderGroupAdmin = async () => {
      const res = await orderServices.getOrderGroup();
      setData(res.data);
    };
    fetchOrderGroupAdmin();
  }, []);

  console.log("data", data);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder();
    console.log("res", res);
    return res;
  };

  const {
    isPending: isPendingOders,
    data: orders,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const cellValue = record[dataIndex];
      return cellValue
        ? cellValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },

    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          // setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: "User name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      // sorter: (a, b) => a.phone.length - b.phone.length,
      // ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      // sorter: (a, b) => (a.address?.length || 0) - (b.address?.length || 0),
      // ...getColumnSearchProps("address"),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      // sorter: (a, b) =>
      //   (a.paymentMethod?.length || 0) - (b.paymentMethod?.length || 0),
      // ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      // sorter: (a, b) =>
      //   (a.totalPrice?.length || 0) - (b.totalPrice?.length || 0),
      // ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const duyethoadon = async (id) => {
    const res = await orderServices.duyethoadon(id);
    console.log("Res", res);
    refetch();
  };

  const duyetthanhtoan = async (id) => {
    const res = await orderServices.duyetthanhtoan(id);
    console.log("Res", res);
    refetch();
  };

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order, index) => {
      console.log("User", user);
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        totalPrice: formatCurrency(order?.totalPrice),
        paymentMethod:
          order?.paymentMethod === "cod"
            ? "Thanh toán khi nhận hàng"
            : order?.paymentMethod,
        status: order?.isDelivereding ? (
          <span className="da-thanh-toan">Đang vận chuyển</span>
        ) : (
          <span className="chua-thanh-toan">Chưa duyệt</span>
        ),
        action: (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "7px",
                cursor: "pointer",
                opacity: order.isDelivereding ? 0.6 : 1,
              }}
              onClick={() => duyethoadon(order._id)}
              disabled={order.isDelivereding}
            >
              Duyệt
            </Button>
            <span
              className={order?.isPaid ? "da-thanh-toan" : "chua-thanh-toan"}
              // style={{
              //   backgroundColor: "red",
              //   color: "white",
              //   border: "none",
              //   padding: "8px 16px",
              //   borderRadius: "7px",
              //   cursor: "pointer",
              //   opacity: order.isPaid ? 0.6 : 1,
              // }}
              onClick={() => duyetthanhtoan(order._id)}
              disabled={order.isPaid}
            >
              {order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
            </span>
          </div>
        ),
      };
    });

  return (
    <div>
      <WrapperHeaderAdmin>Quản lý đơn hàng</WrapperHeaderAdmin>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx={140}
          cy={140}
          outerRadius={100}
          fill="#8884d8" // Default fill color
          dataKey="total_orders" // Key in your data that represents the value
          nameKey="paymentMethod" // Key in your data that represents the name (for labels/tooltips)
        >
          {/* Optional: Define custom slice colors */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(total_orders, paymentMethod, props) => {
            const total = data.reduce(
              (sum, entry) => sum + entry.total_orders,
              0
            );
            const percent = ((total_orders / total) * 100).toFixed(1);
            return [`${total_orders} (${percent}%)`, paymentMethod];
          }}
        />
        <Legend /> {/* Optional: Display a legend */}
      </PieChart>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isPending={isPendingOders}
          data={dataTable}
        />
      </div>
    </div>
  );
};

export default OrderAdmin;
