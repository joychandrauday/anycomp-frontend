// app/components/SecretaryTable.tsx
"use client";

import { useState } from "react";
import {
    Table,
    Button,
    Tag,
    Space,
    Avatar,
    Card,
    Row,
    Col,
    Statistic,
    Input,
    Select,
    Modal,
    message,
    Popconfirm,
    Badge,
    Dropdown,
    Menu
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    StarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { secretaryService } from "@/services/secretaryService";
import { ISecretary } from "@/types";

const { Option } = Select;

interface Secretary {
    id: string;
    user: {
        id: string;
        email: string;
        full_name: string;
        avatar?: string;
    };
    companyName: string;
    secretary_type: string;
    qualification: string;
    years_of_experience: number;
    registration_number: string;
    status: string;
    is_verified: boolean;
    satisfaction_rate: string;
    total_companies_managed: number;
    created_at: string;
    contact_information: {
        office_address: string;
        office_phone: string;
    };
}

interface SecretaryTableProps {
    initialSecretaries: ISecretary[];
}
import type { MenuProps } from "antd";

export default function SecretaryTable({ initialSecretaries }: SecretaryTableProps) {
    const [secretaries, setSecretaries] = useState<ISecretary[]>(initialSecretaries);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [verificationFilter, setVerificationFilter] = useState<string | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSecretary, setSelectedSecretary] = useState<ISecretary | null>(null);

    const fetchSecretaries = async () => {
        try {
            setLoading(true);
            const response = await secretaryService.getAll();
            setSecretaries(response.data || []);
        } catch (error) {
            message.error("Failed to fetch secretaries");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const handleStatusFilter = (value: string | null) => {
        setStatusFilter(value);
    };

    const handleVerificationFilter = (value: string | null) => {
        setVerificationFilter(value);
    };

    const handleDelete = async (id: string) => {
        try {
            // await secretaryService.delete(id);
            message.success("Secretary deleted successfully");
            fetchSecretaries();
        } catch (error) {
            message.error("Failed to delete secretary");
        }
    };

    const handleBulkDelete = async () => {
        try {
            // await Promise.all(selectedRowKeys.map(id => secretaryService.delete(id.toString())));
            message.success("Selected secretaries deleted successfully");
            setSelectedRowKeys([]);
            fetchSecretaries();
        } catch (error) {
            message.error("Failed to delete secretaries");
        }
    };

    const columns = [
        {
            title: "Secretary",
            dataIndex: "user",
            key: "user",
            width: 250,
            render: (user: any, record: ISecretary) => (
                <Space>
                    <Avatar
                        src={user.avatar}
                        icon={!user.avatar && <UserOutlined />}
                        size="large"
                    />
                    <div>
                        <div className="font-medium">{user.full_name || user.email}</div>
                        <div className="text-gray-500 text-sm">
                            <MailOutlined /> {user.email}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Company",
            dataIndex: "companyName",
            key: "companyName",
            width: 180,
            render: (companyName: string) => (
                <div className="font-medium">{companyName}</div>
            ),
        },
        {
            title: "Type",
            dataIndex: "secretary_type",
            key: "secretary_type",
            width: 120,
            render: (type: string) => (
                <Tag color={type === "individual" ? "blue" : "purple"}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Experience",
            dataIndex: "years_of_experience",
            key: "years_of_experience",
            width: 120,
            render: (years: number) => (
                <div className="text-center">
                    <div className="font-bold text-lg">{years}</div>
                    <div className="text-gray-500 text-xs">years</div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) => (
                <Badge
                    status={status === "active" ? "success" : "error"}
                    text={<span className="capitalize">{status}</span>}
                />
            ),
        },
        {
            title: "Verification",
            dataIndex: "is_verified",
            key: "is_verified",
            width: 120,
            render: (verified: boolean) => (
                verified ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Verified
                    </Tag>
                ) : (
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                        Pending
                    </Tag>
                )
            ),
        },
        {
            title: "Rating",
            dataIndex: "satisfaction_rate",
            key: "satisfaction_rate",
            width: 120,
            render: (rate: string) => (
                <Space>
                    <StarOutlined style={{ color: "#fadb14" }} />
                    <span className="font-medium">{rate}</span>
                    <span className="text-gray-500">/5.0</span>
                </Space>
            ),
        },
        {
            title: "Companies Managed",
            dataIndex: "total_companies_managed",
            key: "total_companies_managed",
            width: 140,
            render: (count: number) => (
                <div className="text-center">
                    <div className="font-bold text-lg">{count}</div>
                    <div className="text-gray-500 text-xs">companies</div>
                </div>
            ),
        },
        {
            title: "Contact",
            dataIndex: "contact_information",
            key: "contact",
            width: 200,
            render: (contact: any) => (
                <div className="space-y-1">
                    {contact?.office_phone && (
                        <div className="text-gray-600 text-sm">
                            <PhoneOutlined /> {contact.office_phone}
                        </div>
                    )}
                    {contact?.office_address && (
                        <div className="text-gray-600 text-sm truncate">
                            <EnvironmentOutlined /> {contact.office_address}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Registered",
            dataIndex: "created_at",
            key: "created_at",
            width: 150,
            render: (date: string) => (
                <div className="text-gray-600">
                    {dayjs(date).format("DD MMM YYYY")}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: "right" as const,
            render: (_: any, record: ISecretary) => {
                const items: MenuProps["items"] = [
                    {
                        key: "view",
                        icon: <EyeOutlined />,
                        label: "View Details",
                        onClick: () => viewSecretary(record),
                    },
                    {
                        key: "edit",
                        icon: <EditOutlined />,
                        label: "Edit",
                        onClick: () => editSecretary(record),
                    },
                    {
                        type: "divider",
                    },
                    {
                        key: "delete",
                        icon: <DeleteOutlined />,
                        danger: true,
                        label: "Delete",
                        onClick: () => {
                            Modal.confirm({
                                title: "Delete Secretary",
                                content: `Are you sure you want to delete ${record?.user?.full_name || record?.user?.email
                                    }?`,
                                okText: "Delete",
                                okType: "danger",
                                cancelText: "Cancel",
                                onOk: () => handleDelete(record.id),
                            });
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        }

    ];

    const filteredData = secretaries.filter(secretary => {
        const matchesSearch =
            !searchText ||
            secretary?.user?.email.toLowerCase().includes(searchText.toLowerCase()) ||
            (secretary.user && secretary.user.full_name.toLowerCase().includes(searchText.toLowerCase())) ||
            secretary.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
            secretary.registration_number.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus =
            !statusFilter ||
            secretary.status === statusFilter;

        const matchesVerification =
            verificationFilter === null ||
            (verificationFilter === "verified" && secretary.is_verified) ||
            (verificationFilter === "pending" && !secretary.is_verified);

        return matchesSearch && matchesStatus && matchesVerification;
    });

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => {
            setSelectedRowKeys(keys);
        },
    };

    const viewSecretary = (secretary: ISecretary) => {
        setSelectedSecretary(secretary);
        setModalVisible(true);
    };

    const editSecretary = (secretary: ISecretary) => {
        message.info("Edit functionality to be implemented");
    };

    const stats = {
        total: secretaries.length,
        active: secretaries.filter(s => s.status === "active").length,
        verified: secretaries.filter(s => s.is_verified).length,
        individual: secretaries.filter(s => s.secretary_type === "individual").length,
    };

    return (
        <div className=" mx-auto p-6"
            style={
                {
                    width: "980px"
                }
            }
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Secretaries</h1>
                <p className="text-gray-600 mt-2">Manage and oversee all secretary profiles and their activities</p>
            </div>

            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Secretaries"
                            value={stats.total}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Active"
                            value={stats.active}
                            valueStyle={{ color: "#52c41a" }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Verified"
                            value={stats.verified}
                            valueStyle={{ color: "#1890ff" }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Individual"
                            value={stats.individual}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters and Actions */}
            <Card className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                        <Input
                            placeholder="Search by name, email, company..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full md:w-64"
                            allowClear
                        />

                        <Select
                            placeholder="Status"
                            allowClear
                            onChange={handleStatusFilter}
                            className="w-full md:w-32"
                        >
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>

                        <Select
                            placeholder="Verification"
                            allowClear
                            onChange={handleVerificationFilter}
                            className="w-full md:w-32"
                        >
                            <Option value="verified">Verified</Option>
                            <Option value="pending">Pending</Option>
                        </Select>

                        <Button icon={<FilterOutlined />}>
                            More Filters
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {selectedRowKeys.length > 0 && (
                            <Popconfirm
                                title="Delete selected secretaries?"
                                onConfirm={handleBulkDelete}
                                okText="Yes"
                                cancelText="No"
                                okType="danger"
                            >
                                <Button danger icon={<DeleteOutlined />}>
                                    Delete ({selectedRowKeys.length})
                                </Button>
                            </Popconfirm>
                        )}

                        <Button type="primary" icon={<PlusOutlined />}
                            onClick={() => window.location.replace(`/secretaries/create`)}
                        >
                            Add Secretary
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <div
                // className="max-w-full"
                style={{
                    width: '700px !important',
                }}
            >
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} secretaries`,
                    }}
                    rowSelection={rowSelection}
                    scroll={{ x: 600 }}
                    expandable={{
                        expandedRowRender: (record) => (
                            <div className="p-4 bg-gray-50 rounded">
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <div className="space-y-2">
                                            <div className="text-gray-500">Qualification</div>
                                            <div className="font-medium">{record.qualification}</div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="space-y-2">
                                            <div className="text-gray-500">Registration Number</div>
                                            <div className="font-medium">{record.registration_number}</div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div className="space-y-2">
                                            <div className="text-gray-500">Accepting New</div>
                                            <div>
                                                <Space>
                                                    <Tag color={record.is_accepting_new_companies ? "green" : "red"}>
                                                        Companies: {record.is_accepting_new_companies ? "Yes" : "No"}
                                                    </Tag>
                                                    <Tag color={record.is_accepting_new_specialists ? "green" : "red"}>
                                                        Specialists: {record.is_accepting_new_specialists ? "Yes" : "No"}
                                                    </Tag>
                                                </Space>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ),
                    }}
                />
            </div>

            {/* Detail Modal */}
            <Modal
                title="Secretary Details"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={700}
            >
                {selectedSecretary && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <Avatar
                                src={selectedSecretary?.user?.avatar}
                                size={80}
                                icon={!selectedSecretary?.user?.avatar && <UserOutlined />}
                            />
                            <div>
                                <h3 className="text-xl font-bold">{selectedSecretary?.user?.full_name || selectedSecretary?.user?.email}</h3>
                                <p className="text-gray-600">{selectedSecretary?.user?.email}</p>
                                <Space className="mt-2">
                                    <Tag color={selectedSecretary.secretary_type === "individual" ? "blue" : "purple"}>
                                        {selectedSecretary.secretary_type.toUpperCase()}
                                    </Tag>
                                    <Tag color={selectedSecretary.status === "active" ? "success" : "error"}>
                                        {selectedSecretary.status}
                                    </Tag>
                                    {selectedSecretary.is_verified ? (
                                        <Tag color="success">Verified</Tag>
                                    ) : (
                                        <Tag color="warning">Pending Verification</Tag>
                                    )}
                                </Space>
                            </div>
                        </div>

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div className="space-y-2">
                                    <div className="text-gray-500">Company</div>
                                    <div className="font-medium">{selectedSecretary.companyName}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="space-y-2">
                                    <div className="text-gray-500">Registration Number</div>
                                    <div className="font-medium">{selectedSecretary.registration_number}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="space-y-2">
                                    <div className="text-gray-500">Qualification</div>
                                    <div className="font-medium">{selectedSecretary.qualification}</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="space-y-2">
                                    <div className="text-gray-500">Years of Experience</div>
                                    <div className="font-medium">{selectedSecretary.years_of_experience} years</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="space-y-2">
                                    <div className="text-gray-500">Contact Phone</div>
                                    <div className="font-medium">
                                        <PhoneOutlined /> {selectedSecretary.contact_information?.office_phone}
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="space-y-2">
                                    <div className="text-gray-500">Office Address</div>
                                    <div className="font-medium">
                                        <EnvironmentOutlined /> {selectedSecretary.contact_information?.office_address}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
}