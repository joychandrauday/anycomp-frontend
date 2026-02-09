"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
    Table,
    Input,
    Tabs,
    Tag,
    Popover,
    Button,
    message,
    Dropdown,
    MenuProps,
    ConfigProvider,
    Empty,
    Card,
    Spin
} from "antd";
import {
    DownloadIcon,
    Edit,
    EllipsisVertical,
    Trash2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Search
} from "lucide-react";
import { Specialist } from "@/types/specialists";
import { useSession } from "next-auth/react";

interface SpecialistTableProps {
    initialData: Specialist[];
}

export default function SpecialistTableSecretary({ initialData = [] }: SpecialistTableProps) {
    const [data, setData] = useState<Specialist[]>(initialData);
    const [search, setSearch] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("All");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const { data: session } = useSession();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    // Set isClient to true when component mounts (client-side only)
    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- Logic ---
    const filteredData = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];

        return data.filter((item) => {
            const matchesSearch = search ?
                item.title?.toLowerCase().includes(search.toLowerCase()) :
                true;

            const matchesFilter = activeTab === "All" ?
                true :
                activeTab === "Drafts" ?
                    item.is_draft :
                    !item.is_draft;

            return matchesSearch && matchesFilter;
        });
    }, [search, activeTab, data]);

    // Check if data is empty or not provided
    const isEmptyData = !Array.isArray(initialData) || initialData.length === 0;
    const isEmptyFiltered = filteredData.length === 0;



    // Handle publish/unpublish status change
    const handlePublishStatusChange = async (id: string, shouldPublish: boolean) => {
        if (!isClient || !session?.accessToken) {
            message.error("Please wait for session to load");
            return;
        }

        setLoadingId(id);
        try {
            const url = shouldPublish
                ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/specialists/${id}/publish`
                : `${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/specialists/${id}/unpublish`;

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to ${shouldPublish ? 'publish' : 'unpublish'} specialist`);
            }

            const result = await response.json();

            setData((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, is_draft: !shouldPublish } : item
                )
            );

            message.success(`Specialist ${shouldPublish ? 'published' : 'unpublished'} successfully`);
            return result;
        } catch (error: any) {
            message.error(error.message || `Failed to ${shouldPublish ? 'publish' : 'unpublish'} specialist`);
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    // Handle verification status change
    const handleVerificationStatusChange = async (id: string, status: "verified" | "in_review") => {
        if (!isClient || !session?.accessToken) {
            message.error("Please wait for session to load");
            return;
        }

        setLoadingId(id);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/specialists/${id}/verify`;
            const body = JSON.stringify({ status });
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`
                },
                body
            });

            if (!response.ok) {
                throw new Error(`Failed to update verification status`);
            }

            const result = await response.json();

            setData((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, verification_status: status } : item
                )
            );

            message.success(`Specialist ${status === "verified" ? 'verified' : 'unverified'} successfully`);
            return result;
        } catch (error: any) {
            message.error(error.message || `Failed to update verification status`);
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    // Action Menu Content
    const ActionMenu = ({ record }: { record: Specialist }) => (
        <div className="flex flex-col gap-1 p-1 bg-transparent">
            <button
                // onClick={() => handleEditClick(record)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full"
            >
                <Edit size={14} /> Edit
            </button>
            <button
                onClick={() => console.log("Delete", record.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full"
            >
                <Trash2 size={14} /> Delete
            </button>
        </div>
    );

    // Publish status dropdown items
    const getPublishStatusMenu = (record: Specialist): MenuProps => ({
        items: [
            {
                key: 'publish',
                label: 'Publish',
                disabled: !record.is_draft || loadingId === record.id || !isClient,
                onClick: () => handlePublishStatusChange(record.id, true),
            },
            {
                key: 'unpublish',
                label: 'Unpublish',
                disabled: record.is_draft || loadingId === record.id || !isClient,
                onClick: () => handlePublishStatusChange(record.id, false),
            },
        ],
        className: 'status-dropdown'
    });

    // Verification status dropdown items
    const getVerificationStatusMenu = (record: Specialist): MenuProps => ({
        items: [
            {
                key: 'verify',
                label: 'Verify',
                disabled: record.verification_status === "verified" || loadingId === record.id || !isClient,
                onClick: () => handleVerificationStatusChange(record.id, "verified"),
            },
            {
                key: 'unverify',
                label: 'Unverify',
                disabled: record.verification_status !== "verified" || loadingId === record.id || !isClient,
                onClick: () => handleVerificationStatusChange(record.id, "in_review"),
            },
        ],
        className: 'status-dropdown'
    });

    const columns = [
        {
            title: "Service",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
        },
        {
            title: "Price",
            dataIndex: "base_price",
            key: "price",
            render: (price: number) => <span className="text-gray-600">RM{price}</span>,
        },
        {
            title: "Duration",
            dataIndex: "duration_days",
            key: "duration_days",
            render: (days: number) => <span className="text-gray-600">{days} days</span>,
        },
        {
            title: "Verification Status",
            dataIndex: "verification_status",
            key: "verification_status",
            render: (status: string, record: Specialist) => (
                <Dropdown
                    menu={getVerificationStatusMenu(record)}
                    trigger={['click']}
                    placement="bottom"
                    disabled={loadingId === record.id || !isClient}
                >
                    <Button
                        type="text"
                        className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded-md transition-colors"
                        loading={loadingId === record.id}
                    >
                        <Tag
                            className="rounded-full px-3 border-none cursor-pointer"
                            color={status === "verified" ? "green" : "red"}
                        >
                            {status === "verified" ? "Verified" : "Not Verified"}
                        </Tag>
                        {isClient && <ChevronDown size={12} className="text-gray-400" />}
                    </Button>
                </Dropdown>
            ),
        },
        {
            title: "Publish Status",
            dataIndex: "is_draft",
            key: "status",
            render: (isDraft: boolean, record: Specialist) => (
                <Dropdown
                    menu={getPublishStatusMenu(record)}
                    trigger={['click']}
                    placement="bottom"
                    disabled={loadingId === record.id || !isClient}
                >
                    <Button
                        type="text"
                        className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded-md transition-colors"
                        loading={loadingId === record.id}
                    >
                        <Tag
                            className="rounded-full px-3 border-none cursor-pointer"
                            color={isDraft ? "blue" : "green"}
                        >
                            {isDraft ? "Not Published" : "Published"}
                        </Tag>
                        {isClient && <ChevronDown size={12} className="text-gray-400" />}
                    </Button>
                </Dropdown>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right" as const,
            render: (_: any, record: Specialist) => (
                <Popover
                    content={<ActionMenu record={record} />}
                    trigger={isClient ? "click" : []}
                    placement="bottomRight"
                    overlayClassName="action-popover"
                >

                    <Button
                        type="text"
                        shape="circle"
                        icon={<EllipsisVertical size={18} />}
                        className="flex items-center justify-center hover:bg-gray-100"
                        disabled={!isClient}
                    />
                </Popover>
            ),
        },
    ];

    // Custom pagination configuration
    const paginationConfig = {
        current: currentPage,
        pageSize: pageSize,
        total: filteredData.length,
        showSizeChanger: true,
        showTotal: (total: number, range: [number, number]) => (
            <span className="text-gray-600 text-sm">
                Showing {range[0]}-{range[1]} of {total} services
            </span>
        ),
        itemRender: (page: number, type: string, originalElement: React.ReactNode) => {
            if (type === 'prev') {
                return (
                    <button className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors">
                        {isClient && <ChevronLeft size={16} />}
                    </button>
                );
            }
            if (type === 'next') {
                return (
                    <button className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors">
                        {isClient && <ChevronRight size={16} />}
                    </button>
                );
            }
            if (type === 'page') {
                return (
                    <button className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${page === currentPage ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                        {page}
                    </button>
                );
            }
            return originalElement;
        },
        onChange: (page: number, pageSize: number) => {
            if (isClient) {
                setCurrentPage(page);
                setPageSize(pageSize);
            }
        },
        pageSizeOptions: ['5', '10', '20', '50'],
    };

    // Custom empty state component
    const CustomEmpty = () => {
        if (!isClient) {
            return (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                    <div className="flex flex-col items-center justify-center py-12">
                        <Spin size="large" />
                        <p className="mt-4 text-gray-600">Loading specialists...</p>
                    </div>
                </Card>
            );
        }

        if (isEmptyData) {
            return (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                    <Empty
                        image={<PlusCircle className="w-16 h-16 text-gray-300 mx-auto" />}
                        description={
                            <div className="space-y-4">
                                <p className="text-lg font-semibold text-gray-700">No Specialists Found</p>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    You haven't added any specialists yet. Start by creating your first specialist service.
                                </p>
                            </div>
                        }
                    >
                        <Button
                            type="primary"
                            icon={<PlusCircle size={16} />}
                            className="bg-[#00204E] hover:bg-blue-900"
                        >
                            Create First Specialist
                        </Button>
                    </Empty>
                </Card>
            );
        }

        if (search && isEmptyFiltered) {
            return (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                    <Empty
                        image={<Search className="w-16 h-16 text-gray-300 mx-auto" />}
                        description={
                            <div className="space-y-4">
                                <p className="text-lg font-semibold text-gray-700">No Matching Results</p>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    No specialists found matching "{search}". Try a different search term or clear the search.
                                </p>
                            </div>
                        }
                    >
                        <Button
                            onClick={() => setSearch("")}
                            type="default"
                        >
                            Clear Search
                        </Button>
                    </Empty>
                </Card>
            );
        }

        if (isEmptyFiltered && activeTab !== "All") {
            return (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                    <Empty
                        description={
                            <div className="space-y-4">
                                <p className="text-lg font-semibold text-gray-700">
                                    No {activeTab === "Published" ? "Published" : "Draft"} Specialists
                                </p>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    {activeTab === "Published"
                                        ? "You don't have any published specialists yet. Publish a draft or create a new one."
                                        : "You don't have any draft specialists. Create a new one or check your published specialists."}
                                </p>
                            </div>
                        }
                    >
                        <Button
                            type={activeTab === "Published" ? "default" : "primary"}
                            onClick={() => activeTab === "Published" ? setActiveTab("Drafts") : setActiveTab("Published")}
                        >
                            View {activeTab === "Published" ? "Drafts" : "Published"} Specialists
                        </Button>
                    </Empty>
                </Card>
            );
        }

        return null;
    };

    // Don't render interactive elements until client-side
    if (!isClient) {
        return (
            <div className="w-full space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-1/3">
                        <div className="h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-32 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="w-32 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                <Card>
                    <div className="py-20">
                        <Spin size="large" className="mx-auto block" />
                        <p className="text-center mt-4 text-gray-600">Loading specialists table...</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        colorBgContainer: 'transparent',
                        headerBg: 'transparent',
                        borderColor: '#e5e7eb',
                        headerSplitColor: 'transparent',
                    },
                    Pagination: {
                        itemBg: 'transparent',
                        itemActiveBg: '#2563eb',
                        itemInputBg: 'transparent',
                        colorPrimary: '#2563eb',
                        colorPrimaryHover: '#1d4ed8',
                        colorText: '#4b5563',
                        colorTextDisabled: '#9ca3af',
                    },
                },
            }}
        >
            <div className="w-full space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => {
                            if (isClient) setActiveTab(key);
                        }}
                        items={[
                            {
                                key: "All",
                                label: `All Specialists (${data.length})`
                            },
                            {
                                key: "Published",
                                label: `Published (${data.filter(item => !item.is_draft).length})`
                            },
                            {
                                key: "Drafts",
                                label: `Drafts (${data.filter(item => item.is_draft).length})`
                            },
                        ]}
                        className="custom-table-tabs"
                        style={{ marginBottom: -1 }}
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="w-full md:w-1/3">
                        <Input
                            placeholder="Search by name..."
                            prefix={<Search className="text-gray-400" size={16} />}
                            className="h-9 rounded-lg"
                            value={search}
                            onChange={(e) => {
                                if (isClient) setSearch(e.target.value);
                            }}
                            allowClear
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-[#00204E] text-white px-4 py-2 hover:bg-blue-900 transition rounded-lg flex items-center">
                            <PlusCircle size={16} className="mr-2" /> Create New
                        </button>
                        <button className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition flex items-center rounded-lg">
                            <DownloadIcon size={16} className="mr-2" /> Export
                        </button>
                    </div>
                </div>

                {isEmptyFiltered ? (
                    <CustomEmpty />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        className="antd-transparent-table"
                        pagination={paginationConfig}
                        onChange={(pagination) => {
                            if (isClient) {
                                if (pagination.current) setCurrentPage(pagination.current);
                                if (pagination.pageSize) setPageSize(pagination.pageSize);
                            }
                        }}
                        locale={{
                            emptyText: <CustomEmpty />
                        }}
                    />
                )}

                <style jsx global>{`
                    .antd-transparent-table .ant-table { 
                        background: transparent !important; 
                    }
                    
                    .antd-transparent-table .ant-table-thead > tr > th {
                        background: transparent !important;
                        border-bottom: 1px solid #e5e7eb !important;
                        color: #6b7280 !important;
                        font-weight: 600 !important;
                        text-transform: uppercase !important;
                        font-size: 12px !important;
                        letter-spacing: 0.05em !important;
                    }
                    
                    .antd-transparent-table .ant-table-tbody > tr > td {
                        border-bottom: 1px solid #f3f4f6 !important;
                    }
                    
                    .antd-transparent-table .ant-table-tbody > tr:hover > td {
                        background-color: #f9fafb !important;
                    }
                    
                    .custom-table-tabs .ant-tabs-nav { 
                        margin-bottom: 0 !important; 
                    }
                    
                    .custom-table-tabs .ant-tabs-tab {
                        padding: 12px 16px !important;
                        margin-right: 8px !important;
                        border-radius: 8px 8px 0 0 !important;
                        transition: all 0.2s ease !important;
                    }
                    
                    .custom-table-tabs .ant-tabs-tab:hover {
                        background-color: #f3f4f6 !important;
                    }
                    
                    .custom-table-tabs .ant-tabs-tab-active {
                        background-color: white !important;
                        border-bottom: 2px solid #2563eb !important;
                    }
                    
                    .status-dropdown .ant-dropdown-menu {
                        padding: 4px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        min-width: 120px;
                    }
                    
                    .status-dropdown .ant-dropdown-menu-item {
                        padding: 8px 12px;
                        border-radius: 4px;
                        font-size: 14px;
                    }
                    
                    .status-dropdown .ant-dropdown-menu-item:hover {
                        background-color: #f5f5f5;
                    }
                    
                    .action-popover .ant-popover-inner {
                        padding: 8px !important;
                        borderRadius: 8px !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                    }
                    
                    /* Custom pagination styles - FULLY ROUNDED */
                    .ant-pagination {
                        display: flex !important;
                        align-items: center !important;
                        padding: 16px 0 !important;
                        margin-top: 24px !important;
                        border-top: 1px solid #e5e7eb !important;
                    }
                    
                    .ant-table-pagination-end {
                        justify-content: center !important;
                    }
                    
                    .ant-pagination-prev,
                    .ant-pagination-next,
                    .ant-pagination-jump-prev,
                    .ant-pagination-jump-next {
                        min-width: 32px !important;
                        height: 32px !important;
                    }
                    
                    /* Pagination items - FULLY ROUNDED */
                    .ant-pagination-item {
                        min-width: 32px !important;
                        height: 32px !important;
                        border: 1px solid #e5e7eb !important;
                        border-radius: 50% !important;
                        margin: 0 4px !important;
                        transition: all 0.2s ease !important;
                    }
                    
                    .ant-pagination-item:hover {
                        border-color: #2563eb !important;
                        background-color: #f0f9ff !important;
                    }
                    
                    .ant-pagination-item-active {
                        border-color: #2563eb !important;
                        background-color: #2563eb !important;
                        border-radius: 50% !important;
                    }
                    
                    .ant-pagination-item-active a {
                        color: white !important;
                    }
                    
                    /* Prev/Next buttons - FULLY ROUNDED */
                    .ant-pagination-prev .ant-pagination-item-link,
                    .ant-pagination-next .ant-pagination-item-link {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        border-radius: 50% !important;
                        border: 1px solid #e5e7eb !important;
                        background: transparent !important;
                    }
                    
                    .ant-pagination-prev:hover .ant-pagination-item-link,
                    .ant-pagination-next:hover .ant-pagination-item-link {
                        border-color: #2563eb !important;
                        color: #2563eb !important;
                    }
                    
                    /* Size changer - FULLY ROUNDED */
                    .ant-pagination-options {
                        margin-left: 16px !important;
                    }
                    
                    .ant-pagination-options .ant-select-selector {
                        border-radius: 50px !important;
                        border: 1px solid #e5e7eb !important;
                        padding: 4px 8px !important;
                    }
                    
                    .ant-pagination-options .ant-select {
                        border-radius: 50px !important;
                    }
                    
                    .ant-pagination-options .ant-select-dropdown {
                        border-radius: 8px !important;
                    }
                    
                    .ant-pagination-options .ant-select-item {
                        border-radius: 4px !important;
                    }
                    
                    /* Ellipsis dots */
                    .ant-pagination-item-ellipsis {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        min-width: 32px !important;
                        height: 32px !important;
                        color: #6b7280 !important;
                    }
                    
                    .ant-pagination-total-text {
                        color: #6b7280 !important;
                        font-size: 14px !important;
                    }
                    
                    .ant-pagination-disabled .ant-pagination-item-link {
                        color: #9ca3af !important;
                        border-color: #e5e7eb !important;
                        cursor: not-allowed !important;
                    }
                    
                    /* Remove default Ant Design focus styles */
                    .ant-pagination-item:focus,
                    .ant-pagination-item-link:focus {
                        outline: none !important;
                        box-shadow: none !important;
                    }
                    
                    /* Ensure all pagination elements are properly rounded */
                    .ant-pagination-jump-prev,
                    .ant-pagination-jump-next {
                        border-radius: 50% !important;
                    }
                    
                    /* Style the jump prev/next buttons */
                    .ant-pagination-jump-prev .ant-pagination-item-link,
                    .ant-pagination-jump-next .ant-pagination-item-link {
                        border-radius: 50% !important;
                        border: 1px solid #e5e7eb !important;
                    }
                    
                    /* Fix for select dropdown items */
                    .ant-select-item-option {
                        border-radius: 4px !important;
                    }
                    
                    .ant-select-item-option-selected {
                        background-color: #f0f9ff !important;
                    }
                    
                    /* Empty state styles */
                    .ant-empty {
                        padding: 40px 0 !important;
                    }
                    
                    .ant-empty-image {
                        margin-bottom: 16px !important;
                    }
                    
                    .ant-empty-description {
                        color: #6b7280 !important;
                        font-size: 14px !important;
                        line-height: 1.5 !important;
                    }
                `}</style>
            </div>
        </ConfigProvider>
    );
}