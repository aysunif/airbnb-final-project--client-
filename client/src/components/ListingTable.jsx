import React from "react";
import { Table, Button, Popconfirm, Tag, Grid } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

const ListingTable = ({ listings, onApprove, onDelete, onDetails }) => {
  const screens = useBreakpoint(); 

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      responsive: ["md"], 
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`, 
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved) => (
        <Tag color={isApproved ? "green" : "red"}>
          {isApproved ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => onApprove(record._id)}
            disabled={record.isApproved}
          >
            Approve
          </Button>
          <Popconfirm
            title="Are you sure to delete this listing?"
            onConfirm={() => onDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button style={{ marginLeft: 8 }} danger>
              Delete
            </Button>
          </Popconfirm>
          <Button
            style={{ marginLeft: 8 }}
            icon={<InfoCircleOutlined />}
            onClick={() => onDetails(record._id)}
          >
            {screens.md ? "Details" : null} 
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={listings}
      columns={columns}
      rowKey="_id"
      scroll={{ x: screens.xs ? 500 : undefined }} 
    />
  );
};

export default ListingTable;