import React from "react";
import { Table, Button, Popconfirm, Tag } from "antd";

const UserTable = ({ users, onBan, onDelete }) => {
  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "isBanned",
      key: "isBanned",
      render: (isBanned) => (
        <Tag color={isBanned ? "red" : "green"}>
          {isBanned ? "Banned" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            style={{ marginLeft: 8 }}
            danger
            onClick={() => onBan(record._id)}
          >
            {record.isBanned ? "Unban" : "Ban"}
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => onDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button style={{ marginLeft: 8 }} danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table dataSource={users} columns={columns} rowKey="_id" />;
};

export default UserTable;