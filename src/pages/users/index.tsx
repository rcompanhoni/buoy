import { useEffect, useState } from "react";
import { Table, Typography, Spin, Alert, Image } from "antd";
import ContentLayout from "components/layout/content/contentLayout";
import UsersService from "services/users";

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
  const [usersData, setUsersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await UsersService.getAll();
        setUsersData(data?.list || []);
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <ContentLayout>
        <Spin tip="Loading users..." size="large" />
      </ContentLayout>
    );
  }

  if (error) {
    return (
      <ContentLayout>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <Title level={2}>Users</Title>
      <Table
        dataSource={usersData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 13 }}
      />
    </ContentLayout>
  );
}
