import { Table, Typography, Spin, Alert, Image } from "antd";
import { ColumnsType } from "antd/es/table";
import ContentLayout from "components/layout/content/contentLayout";
import { useGetUsers } from "hooks/react-query/users/useGetUsers";
import { UserData } from "services/users/interface";

const { Title } = Typography;
const columns: ColumnsType<UserData> = [
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
    render: (record: UserData) => `${record.firstName} ${record.lastName}`,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a: UserData, b: UserData) => a.email.localeCompare(b.email), // compares the email fields alphabetically.
    sortDirections: ["ascend", "descend"],
  },

  // Reasons for rendering user images with the Ant Design <Image> component:
  // * provides built-in lazy loading, reducing initial page load times for large datasets
  // * includes a fallback to a placeholder image in case of a broken image link
  // * offers built-in support for hover zoom and full-screen preview
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image: string) => (
      <Image
        src={image}
        alt="User Image"
        width={50}
        height={50}
        fallback="https://via.placeholder.com/50"
      />
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
        dataSource={data || []}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 13, showSizeChanger: false }}
      />
    </ContentLayout>
  );
}
