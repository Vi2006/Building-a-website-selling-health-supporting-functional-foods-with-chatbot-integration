import React, { useEffect, useRef, useState } from "react";
import { WrapperHeaderAdmin, WrapperUploadFile } from "./style";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

function formatCurrency(number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(number);
}

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelelte] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeSelect, setTypeSelect] = useState("");
  const [thanhly, setThanhly] = useState([]);
  const [expiredDate, setExpiredDate] = useState(new Date());
  const user = useSelector((state) => state?.user);
  const [data1, setData1] = useState([]);
  const COLORS = ["#FF6F61", "#D4A5A5", "#FFBB28", "#FF8042"];
  const searchInput = useRef(null);

  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    countInStock: "",
    image: "",
    type: "",
    trademark: "",
    manufacturer: "",
    ingredients: "",
    // discount: "",
    expiredDate: expiredDate,
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    countInStock: "",
    image: "",
    type: "",
    trademark: "",
    manufacturer: "",
    ingredients: "",
    // discount: "",
    expiredDate: "",
  });
  // const date = new Date(stateProductDetails.expiredDate);

  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    return ProductService.createProduct({
      ...data,
    });
  });

  const mutationUpdate = useMutationHooks((data) => {
    console.log("data", data);
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, rests);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res.data;
  };

  useEffect(() => {
    const thongKe = async () => {
      const res = await ProductService.thongKe();
      console.log("rES", res);
      setData1(res.data);
    };
    thongKe();
  }, []);

  useEffect(() => {
    console.log("Dât1", data1);
  });

  const renderCustomizedLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      console.log("Dữ liệu từ API:", res.data);
      setStateProductDetails({
        name: res.data.name,
        price: res.data.price,
        description: res.data.description,
        // rating: res.data.rating,
        countInStock: res.data.countInStock,
        image: res.data.image,
        type: res.data.type,
        trademark: res.data.trademark,
        manufacturer: res.data.manufacturer,
        ingredients: res.data.ingredients,
        // discount: res.data.discount,
        expiredDate: res.data.expiredDate,
      });
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  useEffect(() => {
    form.setFieldsValue(stateProductDetails);
  }, [form, stateProductDetails]);

  const handleDetailsProduct = () => {
    if (rowSelected) {
      setIsPendingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
    setIsOpenDrawer(true);
  };

  const navigate = useNavigate();

  const handleThanhLy = () => {
    if (rowSelected) {
      // fetchGetDetailsProduct(rowSelected);
      navigate(`/thanhly/${rowSelected}`);
    }
  };

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("products");
        },
      }
    );
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };
  const typeProduct = useQuery({
    queryKey: ["type-product", loading],
    queryFn: fetchAllTypeProduct,
  });

  const { data, isPending, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const { isPending: isPendingProducts, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  // const renderAction = () => {
  //   return (
  //     <div>
  //       <DeleteOutlined
  //         style={{ color: "red", fontSize: "28px", cursor: "pointer" }}
  //         onClick={() => setIsModalOpenDelelte(true)}
  //       />
  //       <EditOutlined
  //         style={{ color: "orange", fontSize: "28px", cursor: "pointer" }}
  //         onClick={handleDetailsProduct}
  //       />
  //       action: (<Button onClick={() => handleThanhLy()}>Thanh lý</Button>
  //       ),
  //     </div>
  //   );
  // };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText("");
  };

  function daysBetween(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = inputDate - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // console.log("Diffdays", diffDays);
    return diffDays;
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
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
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      showSorterTooltip: false,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      // sorter: (a, b) => a.price - b.price,
      // showSorterTooltip: false,
      // filters: [
      //   {
      //     text: ">= 100",
      //     value: ">=",
      //   },
      //   {
      //     text: "<= 100",
      //     value: "<=",
      //   },
      // ],
      // onFilter: (value, record) => {
      //   if (value === ">=") {
      //     return record.price >= 100;
      //   }
      //   return record.price <= 100;
      // },
    },
    {
      title: "CountInStock",
      dataIndex: "countInStock",
      sorter: (a, b) => a.countInStock - b.countInStock,
      showSorterTooltip: false,
      filters: [
        {
          text: ">= 5",
          value: ">=",
        },
        {
          text: "<= 5",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return Number(record.countInStock) >= 5;
        }
        return Number(record.countInStock) <= 5;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      // render: renderAction,
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return {
        ...product,
        key: product._id,
        dathanhly: product.dathanhly,
        price: formatCurrency(product.price),
        status:
          daysBetween(product?.expiredDate) > 20 ? (
            <span className="con-thoi-han">
              Hạn còn {daysBetween(product?.expiredDate)} ngày
            </span>
          ) : daysBetween(product?.expiredDate) <= 20 &&
            daysBetween(product?.expiredDate) > 0 ? (
            <span className="con-thoi-han">
              Hạn còn {daysBetween(product?.expiredDate)} ngày
            </span>
          ) : daysBetween(product?.expiredDate) <= 0 &&
            product?.dathanhly === false ? (
            <span className="het-thoi-han">
              Đã quá hạn {Math.abs(daysBetween(product?.expiredDate))} ngày
            </span>
          ) : (
            <span className="da-thanh-ly">Đã thanh lý</span>
          ),
        action: (
          <div>
            <DeleteOutlined
              style={{ color: "red", fontSize: "28px", cursor: "pointer" }}
              onClick={() => setIsModalOpenDelelte(true)}
            />
            <EditOutlined
              style={{ color: "orange", fontSize: "28px", cursor: "pointer" }}
              onClick={handleDetailsProduct}
            />
            <Button
              style={{
                backgroundColor:
                  product.dathanhly || daysBetween(product.expiredDate) <= 10
                    ? "#cccccc"
                    : "#ff6b6b",
                color:
                  product.dathanhly || daysBetween(product.expiredDate) <= 10
                    ? "#666666"
                    : "white",
                border: "none",
                cursor:
                  product.dathanhly || daysBetween(product.expiredDate) <= 10
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={
                product.dathanhly || daysBetween(product.expiredDate) <= 10
              }
              onClick={() => handleThanhLy()}
            >
              Thanh lý
            </Button>
          </div>
        ),
      };
    });

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      countInStock: "",
      image: "",
      type: "",
      trademark: "",
      manufacturer: "",
      ingredients: "",
      discount: "",
      expiredDate: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelelte(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("products"); // Làm mới danh sách sản phẩm sau khi update
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      countInStock: "",
      image: "",
      type: "",
      trademark: "",
      manufacturer: "",
      ingredients: "",
      discount: "",
      expiredDate: "",
    });
    form.resetFields();
  };

  const handleSetStart = (date) => {
    const d = new Date(date);
    const iso086Date = d.toISOString();
    console.log("iso086", iso086Date);
    setExpiredDate(iso086Date);
    setStateProduct({ ...stateProduct, expiredDate: iso086Date });
  };

  // const [selected, setSelected] = useState(null);
  const handleSetStartDetails = (date) => {
    const d = new Date(date);
    const iso086Date = d;
    const localDateOnly = d.toISOString().slice(0, 10);
    console.log("iso086", iso086Date);
    // setExpiredDate(iso086Date);
    setStateProductDetails({
      ...stateProductDetails,
      expiredDate: localDateOnly,
    });
  };

  const onFinish = async () => {
    console.log("Dữ liệu gửi đi", stateProduct);
    await mutation.mutateAsync(stateProduct);
    queryClient.invalidateQueries("products"); // Cập nhật danh sách sản phẩm
  };

  useEffect(() => {}, [loading]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setStateProduct((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      };
      return newState;
    });
  };

  const handleOnChangeDetails = (e) => {
    setStateProductDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnChangeAvatar = async (fileList) => {
    if (!fileList.length) return;
    const file = fileList[0];
    if (!file.originFileObj) return;

    file.preview = await getBase64(file.originFileObj);
    setStateProduct((prev) => ({
      ...prev,
      image: file.preview,
    }));
  };

  const handleOnChangeAvatarDetails = async (fileList) => {
    if (!fileList.length) return;
    const file = fileList[0];
    if (!file.originFileObj) return;

    file.preview = await getBase64(file.originFileObj);
    setStateProductDetails((prev) => ({
      ...prev,
      image: file.preview,
    }));
  };

  const queryClient = useQueryClient(); // Lấy instance của queryClient

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("products"); // Làm mới danh sách sản phẩm sau khi update
        },
      }
    );
  };

  const handleChangeSelect = (value) => {
    setTypeSelect(value);
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  return (
    <div>
      <WrapperHeaderAdmin>Quản lý sản phẩm</WrapperHeaderAdmin>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          gap: "50px",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
        <PieChart width={300} height={300}>
          <Pie
            data={data1}
            cx={140}
            cy={140}
            outerRadius={100}
            fill="#8884d8" // Default fill color
            dataKey="count" // Key in your data that represents the value
            nameKey="status" // Key in your data that represents the name (for labels/tooltips)
          >
            {/* Optional: Define custom slice colors */}
            {data1.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(count, status, props) => {
              const total = data1.reduce((sum, entry) => sum + entry.count, 0);
              const percent = ((count / total) * 100).toFixed(1);
              return [`${count} (${percent}%)`, status];
            }}
          />
          <Legend /> {/* Optional: Display a legend */}
        </PieChart>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProducts}
          columns={columns}
          isPending={isPendingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        forceRender
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isPending={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              {/* <Input
                value={stateProduct.type}
                onChange={handleOnChange}
                name="type"
              /> */}
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <Input
                value={stateProduct.countInStock}
                onChange={handleOnChange}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <Input
                value={stateProduct.price}
                onChange={handleOnChange}
                name="price"
              />
            </Form.Item>
            {/* <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your count rating!" },
              ]}
            >
              <Input
                value={stateProduct.rating}
                onChange={handleOnChange}
                name="rating"
              />
            </Form.Item> */}
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <Input.TextArea
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            </Form.Item>
            <Form.Item
              label="Trademark"
              name="trademark"
              rules={[
                {
                  required: true,
                  message: "Please input your trademark!",
                },
              ]}
            >
              <Input
                value={stateProduct.trademark}
                onChange={handleOnChange}
                name="trademark"
              />
            </Form.Item>
            <Form.Item
              label="manufacturer"
              name="manufacturer"
              rules={[
                {
                  required: true,
                  message: "Please input your  manufacturer!",
                },
              ]}
            >
              <Input
                value={stateProduct.manufacturer}
                onChange={handleOnChange}
                name="manufacturer"
              />
            </Form.Item>
            <Form.Item
              label="Ingredients"
              name="ingredients"
              rules={[
                {
                  required: true,
                  message: "Please input your  ingredients!",
                },
              ]}
            >
              <Input
                value={stateProduct.ingredients}
                onChange={handleOnChange}
                name="ingredients"
              />
            </Form.Item>
            <Form.Item
              label="ExpiredDate"
              name="expiredDate"
              rules={[
                {
                  required: true,
                  message: "Please input your  expiredDate!",
                },
              ]}
            >
              <DatePicker
                className="date"
                selected={expiredDate}
                onChange={(date) => handleSetStart(date)}
              />
              {/* <Input
                value={stateProduct.expiredDate}
                onChange={handleOnChange}
                name="expiredDate"
              /> */}
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                { required: true, message: "Please input your count image!" },
              ]}
            >
              <WrapperUploadFile
                fileList={
                  stateProduct.image ? [{ url: stateProduct.image }] : []
                }
                beforeUpload={() => false}
                onChange={(info) => handleOnChangeAvatar(info.fileList)}
                maxCount={1}
              >
                <Button>Select File</Button>
                {stateProduct.image && (
                  <img
                    src={stateProduct.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="Ảnh sản phẩm"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isPending={isPendingUpdate || isPendingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                value={stateProductDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Input
                value={stateProductDetails.type}
                onChange={handleOnChangeDetails}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <Input
                value={stateProductDetails.countInStock}
                onChange={handleOnChangeDetails}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <Input
                value={stateProductDetails.price}
                onChange={handleOnChangeDetails}
                name="price"
              />
            </Form.Item>
            {/* <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your count rating!" },
              ]}
            >
              <Input
                value={stateProductDetails.rating}
                onChange={handleOnChangeDetails}
                name="rating"
              />
            </Form.Item> */}
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <Input.TextArea
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
                name="description"
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
            </Form.Item>
            <Form.Item
              label="trademark"
              name="trademark"
              rules={[
                {
                  required: true,
                  message: "Please input your trademark!",
                },
              ]}
            >
              <Input
                value={stateProductDetails.trademark}
                onChange={handleOnChangeDetails}
                name="trademark"
              />
            </Form.Item>
            <Form.Item
              label="Manufacturer"
              name="manufacturer"
              rules={[
                {
                  required: true,
                  message: "Please input your manufacturer!",
                },
              ]}
            >
              <Input
                value={stateProductDetails.manufacturer}
                onChange={handleOnChangeDetails}
                name="manufacturer"
              />
            </Form.Item>
            <Form.Item
              label="Ingredients"
              name="ingredients"
              rules={[
                {
                  required: true,
                  message: "Please input your ingredients!",
                },
              ]}
            >
              <Input
                value={stateProductDetails.ingredients}
                onChange={handleOnChangeDetails}
                name="ingredients"
              />
            </Form.Item>
            <Form.Item
              label="ExpiredDate"
              name="expiredDate"
              rules={[
                {
                  required: true,
                  message: "Please input your expiredDate!",
                },
              ]}
            >
              <DatePicker
                className="date"
                selected={stateProductDetails.expiredDate}
                onChange={(date) => handleSetStartDetails(date)}
              />
              {/* <Input
                value={stateProductDetails.expiredDate}
                onChange={handleOnChangeDetails}
                name="expiredDate"
              /> */}
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                { required: true, message: "Please input your count image!" },
              ]}
            >
              <WrapperUploadFile
                fileList={
                  stateProductDetails.image
                    ? [{ url: stateProductDetails.image }]
                    : []
                }
                beforeUpload={() => false}
                onChange={(info) => handleOnChangeAvatarDetails(info.fileList)}
                maxCount={1}
              >
                <Button>Select File</Button>
                {stateProductDetails.image && (
                  <img
                    src={stateProductDetails.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="Avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        forceRender
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
