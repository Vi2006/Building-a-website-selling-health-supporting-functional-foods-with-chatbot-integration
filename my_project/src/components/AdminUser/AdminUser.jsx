import React, { useEffect, useRef, useState } from "react";
import { WrapperHeaderAdmin, WrapperUploadFile } from "./style";
import { Button, Form, Input, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { Loading } from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBase64 } from "../../utils";
import * as message from "../../components/Message/Message";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelelte] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: "",
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks((data) => {
    console.log("data", data);
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, rests, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("users"); // Làm mới danh sách sản phẩm sau khi update
        },
      }
    );
  };

  const mutationDeleted = useMutationHooks((data) => {
    console.log("data", data);
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const getAllUsers = async () => {
    const res = await UserService.getAllUser();
    console.log("res", res);
    return res;
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        isAdmin: res.data.isAdmin,
        address: res.data.address,
        avatar: res.data.avatar,
      });
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails); // Sửa thành setFieldsValue
    // console.log("StateProduct", stateProductDetails);
  }, [form, stateUserDetails]);

  const handleDetailsProduct = () => {
    if (rowSelected) {
      setIsPendingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
    setIsOpenDrawer(true);
  };

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

  const { isPending: isPendingUsers, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "28px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelelte(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "28px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText("");
  };

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
    onFilter: (value, record) => {
      const cellValue = record[dataIndex];
      return cellValue
        ? cellValue.toString().toLowerCase().includes(value.toLowerCase())
        : false;
    },

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
      sorter: (a, b) => {
        const nameA = a.name ? a.name.length : 0; // Kiểm tra a.name
        const nameB = b.name ? b.name.length : 0; // Kiểm tra b.name
        return nameA - nameB;
      },
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => (a.address?.length || 0) - (b.address?.length || 0),
      ...getColumnSearchProps("address"),
    },

    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        {
          text: "True",
          value: true,
        },
        {
          text: "False",
          value: false,
        },
      ],
    },
    {
      title: " Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "TRUE" : "FALSE",
      };
    });

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
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

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("users"); // Làm mới danh sách sản phẩm sau khi update
        },
      }
    );
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnChangeAvatarDetails = async (fileList) => {
    if (!fileList.length) return;
    const file = fileList[0];
    if (!file.originFileObj) return;

    file.preview = await getBase64(file.originFileObj);
    setStateUserDetails((prev) => ({
      ...prev,
      avatar: file.preview,
    }));
  };

  const queryClient = useQueryClient(); // Lấy instance của queryClient

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("users"); // Làm mới danh sách sản phẩm sau khi update
        },
      }
    );
  };
  return (
    <div>
      <WrapperHeaderAdmin>Quản lý người dùng</WrapperHeaderAdmin>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUsers}
          columns={columns}
          isPending={isPendingUsers}
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
      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isPending={isPendingUpdate || isPendingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input
                value={stateUserDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                value={stateUserDetails.email}
                onChange={handleOnChangeDetails}
                name="email"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <Input
                value={stateUserDetails.phone}
                onChange={handleOnChangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <Input
                value={stateUserDetails.address}
                onChange={handleOnChangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[
                { required: true, message: "Please input your  avatar!" },
              ]}
            >
              <WrapperUploadFile
                fileList={
                  stateUserDetails.avatar
                    ? [{ url: stateUserDetails.avatar }]
                    : []
                }
                beforeUpload={() => false}
                onChange={(info) => handleOnChangeAvatarDetails(info.fileList)}
                maxCount={1}
              >
                <Button>Select File</Button>
                {stateUserDetails.avatar && (
                  <img
                    src={stateUserDetails.avatar}
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
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc xóa tài khoản này không</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
