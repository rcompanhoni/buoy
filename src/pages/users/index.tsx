import { useIntl } from "react-intl";
import { useState, useMemo } from "react";
import { debounce } from "lodash";
import { Table, Typography, Spin, Alert, Image, Input } from "antd";
import { ColumnsType } from "antd/es/table";
import { UserData } from "services/users/interface";
import ContentLayout from "components/layout/content/contentLayout";
import { useGetUsers } from "hooks/react-query/users/useGetUsers";

export function Users() {
  const { formatMessage } = useIntl();
  const { data, isLoading, isError } = useGetUsers();
  const [filters, setFilters] = useState({ firstName: "", lastName: "" });

  // debounce the filter update to improve UX and avoid unnecessary filtering
  const handleFilterChange = debounce(
    (key: keyof typeof filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    300
  );

  // apply both filters to get filteredData
  // useMemo ensures that filteredData is only recomputed when either data or one of the filters have changed
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((record) => {
      const matchesFirstName = record.firstName
        .toLowerCase()
        .includes(filters.firstName.toLowerCase());

      const matchesLastName = record.lastName
        .toLowerCase()
        .includes(filters.lastName.toLowerCase());

      return matchesFirstName && matchesLastName;
    });
  }, [data, filters]);

  const columns: ColumnsType<UserData> = [
    {
      title: formatMessage({ id: "page.users.table.column.title.id" }),
      dataIndex: "id",
      key: "id",
    },
    {
      title: (
        <Input
          placeholder={formatMessage({
            id: "page.users.table.column.title.first_name.placeholder",
          })}
          onChange={(e) => handleFilterChange("firstName", e.target.value)}
          allowClear
        />
      ),
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: (
        <Input
          placeholder={formatMessage({
            id: "page.users.table.column.title.last_name.placeholder",
          })}
          onChange={(e) => handleFilterChange("lastName", e.target.value)}
          allowClear
        />
      ),
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: formatMessage({ id: "page.users.table.column.title.name" }),
      key: "fullName",
      render: (record: UserData) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: formatMessage({ id: "page.users.table.column.title.email" }),
      dataIndex: "email",
      key: "email",
      sorter: (a: UserData, b: UserData) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },

    // Reasons for rendering user images with the Ant Design <Image> component:
    // * provides built-in lazy loading, reducing initial page load times for large datasets
    // * includes a fallback to a placeholder image in case of a broken image link
    // * offers built-in support for hover zoom and full-screen preview
    {
      title: formatMessage({ id: "page.users.table.column.title.image" }),
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

  if (isError) {
    return (
      <ContentLayout>
        <Alert
          message={formatMessage({ id: "page.users.alert.message" })}
          description={formatMessage({ id: "page.users.alert.description" })}
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
        <Spin tip={formatMessage({ id: "page.users.spin.tip" })} size="large" />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <Typography.Title level={2}>
        {formatMessage({ id: "page.users.title" })}
      </Typography.Title>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 13, showSizeChanger: false }}
      />
    </ContentLayout>
  );
}
