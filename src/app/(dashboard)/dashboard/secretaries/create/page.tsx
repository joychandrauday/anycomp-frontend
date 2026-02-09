"use client";

import { useState } from "react";
import {
    Form,
    Input,
    Button,
    Upload,
    Select,
    Card,
    Row,
    Col,
    Typography,
    message,
    DatePicker,
    Switch,
    InputNumber,
    UploadFile,
} from "antd";
import {
    UploadOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    IdcardOutlined,
    DollarOutlined,
    CalendarOutlined,
    CheckOutlined,
    PictureOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { UploadProps } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface SecretaryFormData {
    email: string;
    password: string;
    full_name: string;
    registration_number: string;
    secretary_type: "individual" | "company";
    status: "active" | "inactive";
    registration_date: string;
    expiry_date: string;
    qualification: string;
    experience: string;
    years_of_experience: number;
    hourly_rate: number;
    monthly_rate: number;
    contact_information: {
        office_phone: string;
        mobile_phone: string;
        office_address: string;
    };
    is_accepting_new_companies: boolean;
    role: string;
}

export default function CreateSecretaryForm() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<UploadFile | null>(null);
    const [bannerFile, setBannerFile] = useState<UploadFile | null>(null);

    const { data: session } = useSession()

    const handleAvatarChange: UploadProps["onChange"] = ({ file }) => {
        if (file.status === "done") {
            setAvatarFile(file);
        } else if (file.status === "removed") {
            setAvatarFile(null);
        }
    };

    const handleBannerChange: UploadProps["onChange"] = ({ file }) => {
        if (file.status === "done") {
            setBannerFile(file);
        } else if (file.status === "removed") {
            setBannerFile(null);
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("You can only upload image files!");
            return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error("Image must be smaller than 5MB!");
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);

            const formData = new FormData();

            // Append all form fields
            Object.entries(values).forEach(([key, value]) => {
                if (key === "contact_information") {
                    // Handle nested contact_information object
                    Object.entries(value as Record<string, string>).forEach(([subKey, subValue]) => {
                        formData.append(`contact_information[${subKey}]`, subValue);
                    });
                } else if (key === "registration_date" || key === "expiry_date") {
                    if (value) {
                        formData.append(
                            key,
                            dayjs(value as dayjs.Dayjs).format("YYYY-MM-DD")
                        );
                    }
                } else {
                    formData.append(key, String(value));
                }
            });

            // Append files if they exist
            if (avatarFile && avatarFile.originFileObj) {
                formData.append("avatar", avatarFile.originFileObj);
            }

            if (bannerFile && bannerFile.originFileObj) {
                formData.append("banner", bannerFile.originFileObj);
            }

            // Debug: Log formData entries
            console.log("Form Data Entries:");
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Send request
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/secretaries`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        // Note: Don't set Content-Type header for FormData
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "Failed to create secretary");
            }

            message.success("Secretary created successfully! 🎉");
            form.resetFields();
            setAvatarFile(null);
            setBannerFile(null);

            // You might want to redirect or show a success modal
            window.location.replace('/secretaries')

        } catch (error: any) {
            console.error("Error creating secretary:", error);
            message.error(error.message || "Failed to create secretary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fillSampleData = () => {
        form.setFieldsValue({
            email: "test.secretary7@example.com",
            password: "SecurePass123!",
            full_name: "Jane Doe",
            // registration_number: "REG-2026-104",
            secretary_type: "individual",
            status: "active",
            registration_date: dayjs("2024-01-01"),
            expiry_date: dayjs("2026-01-01"),
            qualification: "Chartered Secretary (ICSA)",
            experience: "Over 8 years of corporate secretarial practice.",
            years_of_experience: 8,
            hourly_rate: 150.00,
            monthly_rate: 2000.00,
            contact_information: {
                office_phone: "+60312345678",
                mobile_phone: "+60123456789",
                office_address: "Level 20, Menara HQ, Kuala Lumpur",
            },
            is_accepting_new_companies: true,
            role: "secretary",
        });
        message.info("Sample data filled. Please review before submitting.");
    };

    return (
        <div className="min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="max-w-6xl mx-auto shadow-lg">
                    <div className="mb-8">
                        <Title level={2}>Create New Secretary</Title>
                        <Text type="secondary">
                            Fill in the details below to register a new secretary in the system
                        </Text>
                    </div>

                    <Button
                        type="dashed"
                        onClick={fillSampleData}
                        className="mb-6"
                    >
                        Fill with Sample Data
                    </Button>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                        className="space-y-6"
                    >
                        <Row gutter={[24, 24]}>
                            {/* Basic Information */}
                            <Col xs={24} lg={12}>
                                <Card title="Basic Information" className="h-full">
                                    <Form.Item
                                        label="Email Address"
                                        name="email"
                                        rules={[
                                            { required: true, message: "Please enter email" },
                                            { type: "email", message: "Please enter a valid email" },
                                        ]}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="secretary@example.com"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[
                                            { required: true, message: "Please enter password" },
                                            { min: 8, message: "Password must be at least 8 characters" },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<UserOutlined />}
                                            placeholder="Enter a secure password"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Full Name"
                                        name="full_name"
                                        rules={[{ required: true, message: "Please enter full name" }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Jane Doe"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Role"
                                        name="role"
                                        initialValue="secretary"
                                    >
                                        <Select disabled>
                                            <Option value="secretary">Secretary</Option>
                                        </Select>
                                    </Form.Item>
                                </Card>
                            </Col>

                            {/* Professional Information */}
                            <Col xs={24} lg={12}>
                                <Card title="Professional Information" className="h-full">
                                    <Form.Item
                                        label="Registration Number"
                                        name="registration_number"
                                        rules={[{ required: true, message: "Please enter registration number" }]}
                                    >
                                        <Input
                                            prefix={<IdcardOutlined />}
                                            placeholder="REG-2026-104"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Secretary Type"
                                        name="secretary_type"
                                        rules={[{ required: true, message: "Please select secretary type" }]}
                                    >
                                        <Select placeholder="Select type">
                                            <Option value="individual">Individual</Option>
                                            <Option value="company">Company</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Status"
                                        name="status"
                                        rules={[{ required: true, message: "Please select status" }]}
                                    >
                                        <Select placeholder="Select status">
                                            <Option value="active">Active</Option>
                                            <Option value="inactive">Inactive</Option>
                                        </Select>
                                    </Form.Item>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Registration Date"
                                                name="registration_date"
                                                rules={[{ required: true, message: "Please select registration date" }]}
                                            >
                                                <DatePicker
                                                    style={{ width: "100%" }}
                                                    format="YYYY-MM-DD"
                                                    placeholder="Select date"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Expiry Date"
                                                name="expiry_date"
                                                rules={[{ required: true, message: "Please select expiry date" }]}
                                            >
                                                <DatePicker
                                                    style={{ width: "100%" }}
                                                    format="YYYY-MM-DD"
                                                    placeholder="Select date"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>

                        {/* Qualifications & Experience */}
                        <Card title="Qualifications & Experience">
                            <Form.Item
                                label="Qualification"
                                name="qualification"
                                rules={[{ required: true, message: "Please enter qualification" }]}
                            >
                                <Input
                                    prefix={<CheckOutlined />}
                                    placeholder="Chartered Secretary (ICSA)"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Years of Experience"
                                name="years_of_experience"
                                rules={[{ required: true, message: "Please enter years of experience" }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={50}
                                    style={{ width: "100%" }}
                                    placeholder="8"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Experience Details"
                                name="experience"
                                rules={[{ required: true, message: "Please enter experience details" }]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Over 8 years of corporate secretarial practice..."
                                />
                            </Form.Item>
                        </Card>

                        {/* Pricing Information */}
                        <Card title="Pricing Information">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Hourly Rate (RM)"
                                        name="hourly_rate"
                                        rules={[{ required: true, message: "Please enter hourly rate" }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: "100%" }}
                                            prefix={<DollarOutlined />}
                                            placeholder="150.00"
                                            step={0.01}
                                            precision={2}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Monthly Rate (RM)"
                                        name="monthly_rate"
                                        rules={[{ required: true, message: "Please enter monthly rate" }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: "100%" }}
                                            prefix={<DollarOutlined />}
                                            placeholder="2000.00"
                                            step={0.01}
                                            precision={2}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Contact Information */}
                        <Card title="Contact Information">
                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Office Phone"
                                        name={["contact_information", "office_phone"]}
                                        rules={[{ required: true, message: "Please enter office phone" }]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="+60312345678"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Mobile Phone"
                                        name={["contact_information", "mobile_phone"]}
                                        rules={[{ required: true, message: "Please enter mobile phone" }]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="+60123456789"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Office Address"
                                        name={["contact_information", "office_address"]}
                                        rules={[{ required: true, message: "Please enter office address" }]}
                                    >
                                        <Input
                                            prefix={<EnvironmentOutlined />}
                                            placeholder="Level 20, Menara HQ, Kuala Lumpur"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Media Uploads */}
                        <Card title="Profile Media">
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Profile Picture (Avatar)">
                                        <Upload
                                            name="avatar"
                                            listType="picture-card"
                                            maxCount={1}
                                            showUploadList={{
                                                showPreviewIcon: true,
                                                showRemoveIcon: true,
                                            }}
                                            beforeUpload={beforeUpload}
                                            onChange={handleAvatarChange}
                                            accept="image/*"
                                        >
                                            {!avatarFile && (
                                                <div className="flex flex-col items-center">
                                                    <PictureOutlined className="text-2xl mb-2" />
                                                    <div>Click to upload</div>
                                                    <div className="text-xs text-gray-500">PNG, JPG up to 5MB</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Banner Image">
                                        <Upload
                                            name="banner"
                                            listType="picture-card"
                                            maxCount={1}
                                            showUploadList={{
                                                showPreviewIcon: true,
                                                showRemoveIcon: true,
                                            }}
                                            beforeUpload={beforeUpload}
                                            onChange={handleBannerChange}
                                            accept="image/*"
                                        >
                                            {!bannerFile && (
                                                <div className="flex flex-col items-center">
                                                    <PictureOutlined className="text-2xl mb-2" />
                                                    <div>Click to upload</div>
                                                    <div className="text-xs text-gray-500">PNG, JPG up to 5MB</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Settings */}
                        <Card title="Settings">
                            <Form.Item
                                name="is_accepting_new_companies"
                                label="Accepting New Companies"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Switch
                                    checkedChildren={<CheckOutlined />}
                                    unCheckedChildren="No"
                                    defaultChecked
                                />
                            </Form.Item>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="default"
                                size="large"
                                onClick={() => form.resetFields()}
                                disabled={loading}
                            >
                                Clear Form
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="min-w-40"
                            >
                                {loading ? "Creating..." : "Create Secretary"}
                            </Button>
                        </div>
                    </Form>
                </Card>
            </motion.div>
        </div>
    );
}