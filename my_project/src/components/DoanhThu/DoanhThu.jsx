import React, { useEffect, useState } from "react";
import { WrapperHeaderAdmin } from "./style";
import { DatePicker, message } from "antd";
import orderServices from "../../services/OrderService";

function formatCurrency(number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(number);
}

function ProductTable(props) {
  console.log("data", props.data);
  return (
    <table>
      <thead>
        <tr>
          <th>Ngày thống kê</th>
          <th>Name</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Sum Of Money</th>
        </tr>
      </thead>
      <tbody>
        {props.data.length ? (
          props.data.map(
            (item) =>
              item.products &&
              item.products.map((product, index) => (
                <tr key={`${item._id}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={item.products.length}>{item._id}</td>
                  )}
                  <td>{product.name}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.amount}</td>
                  {index === 0 && (
                    <td rowSpan={item.products.length}>
                      {formatCurrency(
                        item.products.reduce(
                          (total, p) => total + p.amount * p.price,
                          0
                        )
                      )}
                    </td>
                  )}
                </tr>
              ))
          )
        ) : (
          <div className="vi">Không có dữ liệu</div>
        )}
      </tbody>
    </table>
  );
}

const DoanhThu = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    console.log("start date", startDate);
  }, [startDate]);

  const handleSetStart = (date) => {
    const d = new Date(date);
    const iso086Date = d.toISOString();
    console.log("iso086", iso086Date);
    setStartDate(iso086Date);
  };

  const handleSetEnd = (date) => {
    const d = new Date(date);
    const iSo = d.toISOString();
    setEndDate(iSo);
  };

  const startAnalyse = async () => {
    if (startDate > endDate) {
      message.danger("Vui lòng chọn ngày hợp lệ");
    }

    const res = await orderServices.getMoney({ startDate, endDate });
    if (res.status === 404) {
      message.danger(res.message);
    }
    console.log("res daily", res);
    setOrder(res.data.data);
    setLoading(!loading);
  };
  useEffect(() => {
    console.log("order", order);
  }, [loading]);
  return (
    <div>
      <WrapperHeaderAdmin>Quản lý thống kê doanh thu</WrapperHeaderAdmin>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div>
          <div className="flex date">
            <label className="label2">Ngày bắt đầu:</label>
            <DatePicker
              className="date"
              selected={startDate}
              onChange={(date) => handleSetStart(date)}
            />
          </div>
          <div className="flex date">
            <label className="end-date-label">Ngày kết thúc:</label>
            <DatePicker
              className="date"
              selected={endDate}
              onChange={(date) => handleSetEnd(date)}
            />
          </div>
        </div>
        <div>
          <button className="thongKeButton" onClick={() => startAnalyse()}>
            Thống kê
          </button>
        </div>
      </div>
      <ProductTable data={order}></ProductTable>
    </div>
  );
};

export default DoanhThu;
