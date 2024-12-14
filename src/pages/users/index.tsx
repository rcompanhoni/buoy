import { useState } from "react";
import { Table, Image, Typography } from "antd";
import ContentLayout from "components/layout/content/contentLayout";

const { Text } = Typography;

const mockedData = [
  {
    id: 1,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@x.dummyjson.com",
    image: "https://dummyjson.com/icon/emilys/128",
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Williams",
    email: "michael.williams@x.dummyjson.com",
    image: "https://dummyjson.com/icon/michaelw/128",
  },
];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
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
    title: "Name",
    key: "fullName",
    render: (_: any, record: { firstName: string; lastName: string }) => (
      <Text>{`${record.firstName} ${record.lastName}`}</Text>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Image",
    key: "image",
    render: (_: any, record: { image: string }) => (
      <Image src={record.image} alt="User Image" width={50} height={50} />
    ),
  },
];

export function Users() {
  const [data, setData] = useState(mockedData);

  return (
    <ContentLayout>
      <Typography.Title level={2}>Users</Typography.Title>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 13 }}
      />
    </ContentLayout>
  );
}
