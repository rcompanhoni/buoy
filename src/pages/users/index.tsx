import { Table, Typography, Spin, Alert, Image } from "antd";
import ContentLayout from "components/layout/content/contentLayout";
import { useGetUsers } from "hooks/react-query/users/useGetUsers";

const { Title } = Typography;
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
    render: (record: any) => `${record.firstName} ${record.lastName}`,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image: string) => (
      <Image src={image} alt="User Image" width={50} height={50} />
    ),
  },
];

export function Users() {
  const { data, isLoading, isError } = useGetUsers();

  if (isError) {
    return (
      <ContentLayout>
        <Alert
          message="Error"
          description="Failed to fetch users"
          type="error"
          showIcon
          closable
        />
      </ContentLayout>
    );
  }

  if (isLoading) {
    return (
      <ContentLayout>
        <Spin tip="Loading users..." size="large" />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <Title level={2}>Users</Title>
      <Table
        dataSource={data?.list || []}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 13 }}
      />
    </ContentLayout>
  );
}
