"use client";
import React, { useState, useMemo } from "react";
import { Table, Input, Tabs, Tag, Popover, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DownloadIcon, Edit, EllipsisVertical, Trash2 } from "lucide-react";
import { specialistService } from "@/services/specialistService";
import { Specialist } from "@/types/specialists";
import { MultiStepEditDrawer } from "./MultiStepEditDrawer";

interface SpecialistTableProps {
    initialData: Specialist[];
    secretaries: any[]; // Adjust type as needed
}

export default function SpecialistTable({ initialData, secretaries }: SpecialistTableProps) {
    const [data, setData] = useState<Specialist[]>(initialData);
    const [search, setSearch] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("All");

    // Drawer States
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<Specialist | null>(null);

    // --- Logic ---
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            const matchesFilter =
                activeTab === "All"
                    ? true
                    : activeTab === "Drafts"
                        ? item.is_draft
                        : !item.is_draft;
            return matchesSearch && matchesFilter;
        });
    }, [search, activeTab, data]);

    const handleEditClick = (record: Specialist) => {
        setSelectedRecord(record);
        setIsDrawerOpen(true);
    };

    const handleUpdate = async (id: string, values: Partial<Specialist>) => {
        try {
            // Using the service method
            const response = await specialistService.update(id, values);

            // Update local state so UI reflects changes
            setData((prev) =>
                prev.map((item) => (item.id === id ? { ...item, ...values } : item))
            );

            return response;
        } catch (error: any) {
            message.error(error.message || "Update failed. Please try again.");
            console.error(error);
            throw error;
        }
    };

    // Action Menu Content
    const ActionMenu = ({ record }: { record: Specialist }) => (
        <div className="flex flex-col gap-1 p-1 bg-transparent">
            <button
                onClick={() => handleEditClick(record)}
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
            title: "Purchases",
            dataIndex: "total_clients_served",
            key: "total_clients_served",
            render: (val: number) => <span className="text-gray-600">{val}</span>,
        },
        {
            title: "Duration",
            dataIndex: "duration_days",
            key: "duration_days",
            render: (days: number) => <span className="text-gray-600">{days} days</span>,
        },
        {
            title: "Approval Status",
            dataIndex: "specialist_status",
            key: "specialist_status",
            render: (status: string) => (
                <Tag
                    className="rounded-full px-3 border-none"
                    color={status === "available" ? "green" : "blue-inverse"}
                >
                    {status === "available" ? "Available" : status || "Unknown"}
                </Tag>
            ),
        },
        {
            title: "Publish Status",
            dataIndex: "is_draft",
            key: "status",
            render: (isDraft: boolean) => (
                <Tag
                    className="rounded-full px-3 border-none"
                    color={isDraft ? "blue-inverse" : "green"}
                >
                    {isDraft ? "Not Published" : "Published"}
                </Tag>
            ),
        },
        {
            title: "Created",
            dataIndex: "created_at",
            key: "created",
            render: (date: string) => (
                <span className="text-gray-400">
                    {new Date(date).toLocaleDateString()}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right" as const,
            render: (_: any, record: Specialist) => (
                <Popover
                    content={<ActionMenu record={record} />}
                    trigger="click"
                    placement="bottomRight"
                    overlayClassName="action-popover"
                >
                    <Button
                        type="text"
                        shape="circle"
                        icon={<EllipsisVertical size={18} />}
                        className="flex items-center justify-center hover:bg-gray-100"
                    />
                </Popover>
            ),
        },
    ];

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        { key: "All", label: `All Specialists` },
                        { key: "Published", label: `Published` },
                        { key: "Drafts", label: `Drafts` },
                    ]}
                    className="custom-table-tabs"
                    style={{ marginBottom: -1 }}
                />
            </div>

            <div className="flex justify-between">
                <div className="w-full md:w-1/3">
                    <Input
                        placeholder="Search by name..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className=" h-9 rounded-lg"
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </div>
                <div className="flex gap-4">
                    <button className="bg-[#00204E] text-white px-4 py-2 hover:bg-blue-900 transition">
                        + Create
                    </button>
                    <button className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition flex items-center">
                        <DownloadIcon size={16} className="mr-2" /> Create Export
                    </button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                className="antd-transparent-table"
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
            />

            {/* Use the new MultiStepEditDrawer component */}
            <MultiStepEditDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                record={selectedRecord}
                secretaries={secretaries}
                onUpdate={handleUpdate}
            />

            <style jsx global>{`
                .antd-transparent-table .ant-table { background: transparent !important; }
                .custom-table-tabs .ant-tabs-nav { margin-bottom: 0 !important; }
            `}</style>
        </div>
    );
}