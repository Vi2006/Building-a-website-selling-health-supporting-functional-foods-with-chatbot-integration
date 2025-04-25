import { Table } from "antd";
import React, { useMemo, useState } from "react";
import { Loading } from "../../components/LoadingComponent/Loading";
import { Excel } from "antd-table-saveas-excel";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data: dataSource = [],
    isPending = false,
    columns = [],
    handleDeleteMany,
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== "action");
    return arr;
  }, [columns]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  const ExportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };

  return (
    <Loading isPending={isPending}>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: "#1d1ddd",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <button onClick={ExportExcel}>Export Excel</button>
      <div style={{ overflow: "auto" }}>
        <Table
          style={{ maxWidth: "100%" }}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={dataSource}
          {...props}
        />
      </div>
    </Loading>
  );
};

export default TableComponent;
