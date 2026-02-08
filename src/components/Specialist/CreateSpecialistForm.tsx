"use client";
import React, { useState, useCallback } from 'react';
import {
    Form,
    Input,
    Button,
    Upload,
    Select,
    InputNumber,
    Card,
    message,
    Tag,
    Typography,
    Divider,
    Flex,
    Checkbox,
    Radio,
    Space,
    Row,
    Col,
    UploadProps,
    Badge,
    Tooltip,
    Avatar
} from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    DollarOutlined,
    PercentageOutlined,
    PictureOutlined,
    CheckOutlined,
    SaveOutlined,
    DownOutlined,
    CloseOutlined,
    InfoCircleOutlined,
    CrownOutlined,
    GiftOutlined,
    ClockCircleOutlined,
    SafetyOutlined,
    FileDoneOutlined,
    HomeOutlined,
    CalendarOutlined,
    MailOutlined,
    MessageOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
// Note: Ensure these imports exist in your project, or adjust paths accordingly
import { specialistService } from '@/services/specialistService';
import { BACKEND_URL } from '@/lib/api';
import { ISecretary } from '@/types';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const ADDITIONAL_OFFERINGS = [
    {
        label: "Company Secretary Subscription (1 month free)",
        value: "cosecs_sub",
        icon: <CrownOutlined />,
        color: "gold",
        description: "Free first month of company secretary services"
    },
    {
        label: "Complimentary Corporate Bank Account Opening",
        value: "bank_opening",
        icon: <GiftOutlined />,
        color: "green",
        description: "Assistance with corporate bank account setup"
    },
    {
        label: "Access Company Records and SSM Forms",
        value: "ssm_access",
        icon: <FileDoneOutlined />,
        color: "blue",
        description: "24/7 access to SSM forms and company records"
    },
    {
        label: "24/7 Secure Access to Statutory Company Records",
        value: "secure_access",
        icon: <SafetyOutlined />,
        color: "purple",
        description: "Secure portal for all company documents"
    },
    {
        label: "Priority Filing (Within 24 hours)",
        value: "priority_filing",
        icon: <ClockCircleOutlined />,
        color: "red",
        description: "Express processing for all filings"
    },
    {
        label: "Registered Office Address Use",
        value: "reg_address",
        icon: <HomeOutlined />,
        color: "orange",
        description: "Use of professional registered office address"
    },
    {
        label: "Compliance Calendar Setup",
        value: "compliance_cal",
        icon: <CalendarOutlined />,
        color: "cyan",
        description: "Custom compliance deadline reminders"
    },
    {
        label: "First Share Certificate Issued Free",
        value: "share_cert",
        icon: <FileDoneOutlined />,
        color: "geekblue",
        description: "Free issuance of initial share certificates"
    },
    {
        label: "CTC Delivery & Courier Handling",
        value: "ctc_delivery",
        icon: <MailOutlined />,
        color: "magenta",
        description: "Certified true copies delivered to you"
    },
    {
        label: "Always-On Chat Support",
        value: "chat_support",
        icon: <MessageOutlined />,
        color: "lime",
        description: "24/7 chat support for urgent queries"
    },
];

interface SpecialistFormValues {
    title: string;
    description: string;
    additional_offerings: string[];
    base_price: number;
    platform_fee: number;
    assigned_secretary_id?: string;
    duration_days: number;
    is_draft: boolean;
}

interface SecretaryOption {
    id: string;
    full_name: string;
    email: string;
    avatar?: string;
}

interface CreateSpecialistFormProps {
    secretaries: ISecretary[];
}

export default function CreateSpecialistForm({
    secretaries,
}: CreateSpecialistFormProps) {
    console.log(secretaries);
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);
    const [publishStatus, setPublishStatus] = useState<'draft' | 'publish'>('draft');
    const [isOfferingDropdownOpen, setIsOfferingDropdownOpen] = useState(false);

    // Calculate final price
    const calculateFinalPrice = (base: number, fee: number) => {
        const numBase = Number(base) || 0;
        const numFee = Number(fee) || 0;
        return numBase + (numBase * numFee / 100);
    };

    // Handle additional offerings selection
    const handleOfferingChange = useCallback((values: string[]) => {
        setSelectedOfferings(values);
        form.setFieldValue('additional_offerings', values);
    }, [form]);

    // Handle main image upload
    const handleMainImageUpload: UploadProps['customRequest'] = ({ file, onSuccess }) => {
        setMainImage(file as File);
        if (onSuccess) {
            onSuccess('ok');
        }
    };

    // Handle additional images upload
    const handleAdditionalImagesUpload: UploadProps['customRequest'] = ({ file, onSuccess }) => {
        if (additionalImages.length < 2) {
            setAdditionalImages(prev => [...prev, file as File]);
            if (onSuccess) {
                onSuccess('ok');
            }
        } else {
            message.warning('Maximum 2 additional images allowed');
        }
    };

    // Remove main image
    const removeMainImage = () => {
        setMainImage(null);
    };

    // Remove additional image
    const removeAdditionalImage = (index: number) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    // Remove selected offering
    const removeOffering = (value: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newValues = selectedOfferings.filter(item => item !== value);
        setSelectedOfferings(newValues);
        form.setFieldValue('additional_offerings', newValues);
    };

    // Form submission
    const handleSubmit = async (values: SpecialistFormValues) => {
        try {
            setLoading(true);

            // Prepare form data
            const formData = new FormData();

            // Append text fields
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'additional_offerings' && Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));
                    } else if (key === 'is_draft') {
                        formData.append(key, publishStatus === 'draft' ? 'true' : 'false');
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            // --- IMAGE APPENDING LOGIC ---

            // 1. Append Main Image as 'image_1'
            if (mainImage) {
                formData.append('image_1', mainImage);
            }

            // 2. Append Additional Images as 'image_2' and 'image_3'
            additionalImages.forEach((img, index) => {
                // index 0 -> image_2
                // index 1 -> image_3
                formData.append(`image_${index + 2}`, img);
            });

            // Create specialist
            const response = await fetch(`${BACKEND_URL}/specialists/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`,
                    // Content-Type is purposely omitted to let browser set boundary for FormData
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create specialist');
            }

            message.success(`Specialist ${publishStatus === 'publish' ? 'published' : 'saved as draft'} successfully!`);
            window.location.href = '/dashboard/service'; // Redirect to specialists list
            form.resetFields();
            setSelectedOfferings([]);
            setMainImage(null);
            setAdditionalImages([]);
            setPublishStatus('draft');

        } catch (error: any) {
            console.error('Error creating specialist:', error);
            message.error(error.message || 'Failed to create specialist');
        } finally {
            setLoading(false);
        }
    };

    // Watch values for calculation
    const basePrice = Form.useWatch('base_price', form);
    const platformFee = Form.useWatch('platform_fee', form);
    const finalPrice = calculateFinalPrice(basePrice, platformFee);

    const getOfferingDetails = (value: string) => {
        return ADDITIONAL_OFFERINGS.find(item => item.value === value);
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-6">
                <Title level={2} className="!mb-1 !text-gray-800">
                    Create New Service
                </Title>
                <Text type="secondary" className="!text-gray-500">
                    Fill in all required details to create a new specialist service
                </Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    base_price: 0,
                    platform_fee: 10,
                    duration_days: 7,
                    additional_offerings: [],
                }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title Input */}
                        <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200">
                            <Form.Item
                                label={
                                    <span className="text-gray-700 font-medium">
                                        Service Title
                                    </span>
                                }
                                name="title"
                                rules={[
                                    { required: true, message: 'Please enter a title' },
                                    { min: 5, message: 'Title must be at least 5 characters' },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Enter service title..."
                                    variant="borderless"
                                    className="!text-xl !font-medium !px-0"
                                />
                            </Form.Item>
                        </Card>

                        {/* Images Section */}
                        <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200">
                            <Title level={5} className="!mb-4 !text-gray-700">
                                Service Images
                            </Title>
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div>
                                    <Text className="!text-gray-600 block mb-2">Main Image (Required)</Text>
                                    {mainImage ? (
                                        <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <PictureOutlined className="text-blue-500 text-lg" />
                                                    <span className="text-gray-700">{mainImage.name}</span>
                                                </div>
                                                <Button
                                                    type="text"
                                                    danger
                                                    size="small"
                                                    onClick={removeMainImage}
                                                    className="!text-red-500 hover:!bg-red-50"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Upload
                                            customRequest={handleMainImageUpload}
                                            showUploadList={false}
                                            accept="image/*"
                                        >
                                            <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-8 text-center cursor-pointer transition-colors">
                                                <UploadOutlined className="text-3xl text-gray-400 mb-2" />
                                                <Text className="block text-gray-600">Click or drag main image here</Text>
                                                <Text type="secondary" className="text-sm">Recommended: 1200x800px</Text>
                                            </div>
                                        </Upload>
                                    )}
                                </div>

                                {/* Additional Images */}
                                <div>
                                    <Text className="!text-gray-600 block mb-2">Additional Images (Optional, max 2)</Text>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {additionalImages.map((img, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <PictureOutlined className="text-gray-500" />
                                                        <span className="text-sm text-gray-600 truncate">{img.name}</span>
                                                    </div>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        size="small"
                                                        onClick={() => removeAdditionalImage(index)}
                                                        className="!text-red-500 hover:!bg-red-50"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {additionalImages.length < 2 && (
                                            <Upload
                                                customRequest={handleAdditionalImagesUpload}
                                                showUploadList={false}
                                                accept="image/*"
                                            >
                                                <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-4 text-center cursor-pointer h-full flex flex-col items-center justify-center">
                                                    <PlusOutlined className="text-gray-400 text-lg mb-1" />
                                                    <Text className="text-sm text-gray-600">Add Image</Text>
                                                </div>
                                            </Upload>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200">
                            <Form.Item
                                label={
                                    <span className="text-gray-700 font-medium">
                                        Service Description
                                        <Tooltip title="Provide a detailed description of your service">
                                            <InfoCircleOutlined className="text-gray-400 ml-2" />
                                        </Tooltip>
                                    </span>
                                }
                                name="description"
                                rules={[
                                    { required: true, message: 'Please enter a description' },
                                    { min: 50, message: 'Description must be at least 50 characters' },
                                ]}
                            >
                                <TextArea
                                    rows={6}
                                    placeholder="Describe the service in detail..."
                                    variant="borderless"
                                    className="!px-0"
                                    showCount
                                    maxLength={2000}
                                />
                            </Form.Item>
                        </Card>

                        {/* Additional Offerings - Dropdown */}
                        <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <Title level={5} className="!mb-0 text-gray-700!">
                                    Additional Offerings
                                </Title>
                                <Badge
                                    count={selectedOfferings.length}
                                    showZero
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                            </div>

                            <Form.Item
                                name="additional_offerings"
                                help={
                                    <Text type="secondary" className="text-sm">
                                        Select add-ons to enhance your service package
                                    </Text>
                                }
                            >
                                <Select
                                    mode="multiple"
                                    value={selectedOfferings}
                                    onChange={handleOfferingChange}
                                    open={isOfferingDropdownOpen}
                                    onDropdownVisibleChange={setIsOfferingDropdownOpen}
                                    suffixIcon={<DownOutlined />}
                                    placeholder="Select additional offerings..."
                                    size="large"
                                    className="w-full offerings-select"
                                    dropdownRender={(menu) => (
                                        <div className="p-2">
                                            <div className="mb-3 px-2">
                                                <Text strong className="text-gray-700">Available Offerings</Text>
                                                <Text type="secondary" className="text-xs block">
                                                    {ADDITIONAL_OFFERINGS.length} offerings available
                                                </Text>
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto">
                                                {menu}
                                            </div>
                                        </div>
                                    )}
                                    tagRender={(props) => {
                                        const offering = getOfferingDetails(props.value);
                                        return (
                                            <Tag
                                                {...props}
                                                closable={true}
                                                onClose={(e) => removeOffering(props.value, e)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-0"
                                                style={{
                                                    backgroundColor: `${offering?.color}15`,
                                                    color: offering?.color,
                                                    border: `1px solid ${offering?.color}30`
                                                }}
                                            >
                                                <span className="text-xs">{offering?.icon}</span>
                                                <span className="text-sm font-medium">{offering?.label}</span>
                                                <CloseOutlined className="text-xs ml-1" />
                                            </Tag>
                                        );
                                    }}
                                >
                                    {ADDITIONAL_OFFERINGS.map((offering) => (
                                        <Option key={offering.value} value={offering.value}>
                                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg"
                                                        style={{
                                                            backgroundColor: `${offering.color}15`,
                                                            color: offering.color
                                                        }}>
                                                        {offering.icon}
                                                    </div>
                                                    <div>
                                                        <Text className="block font-medium text-gray-800">
                                                            {offering.label}
                                                        </Text>
                                                        <Text type="secondary" className="text-xs">
                                                            {offering.description}
                                                        </Text>
                                                    </div>
                                                </div>
                                                {selectedOfferings.includes(offering.value) && (
                                                    <CheckOutlined className="text-green-500 text-sm" />
                                                )}
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Selected Offerings Preview */}
                            {selectedOfferings.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <Text strong className="text-gray-700 mb-3 block">
                                        Selected Offerings ({selectedOfferings.length})
                                    </Text>
                                    <div className="space-y-2">
                                        {selectedOfferings.map((value) => {
                                            const offering = getOfferingDetails(value);
                                            return (
                                                <div key={value}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg"
                                                            style={{
                                                                backgroundColor: `${offering?.color}15`,
                                                                color: offering?.color
                                                            }}>
                                                            {offering?.icon}
                                                        </div>
                                                        <Text className="text-gray-700">{offering?.label}</Text>
                                                    </div>
                                                    <Tooltip title="Remove">
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            icon={<CloseOutlined />}
                                                            onClick={() => {
                                                                const newValues = selectedOfferings.filter(item => item !== value);
                                                                setSelectedOfferings(newValues);
                                                                form.setFieldValue('additional_offerings', newValues);
                                                            }}
                                                            className="!text-gray-400 hover:!text-red-500"
                                                        />
                                                    </Tooltip>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Company Secretary */}
                        <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200">
                            <Form.Item
                                label={
                                    <span className="text-gray-700 font-medium">
                                        Assign Company Secretary
                                    </span>
                                }
                                name="assigned_secretary_id"
                                help={
                                    <Text type="secondary" className="text-sm">
                                        Optional - Assign a dedicated company secretary for this service
                                    </Text>
                                }
                            >
                                <Select
                                    size="large"
                                    placeholder="Select a company secretary (optional)"
                                    variant="borderless"
                                    className="!px-0"
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                    filterOption={(input, option) => {
                                        const label = option?.label?.toString() || '';
                                        return label.toLowerCase().includes(input.toLowerCase());
                                    }}
                                    options={secretaries.map(secretary => ({
                                        value: secretary?.user?.id,
                                        label: secretary.full_name || secretary.email,
                                        email: secretary.email,
                                        avatar: secretary.avatar
                                    }))}
                                    optionRender={(option) => (
                                        <div className="flex items-center gap-3 py-2">
                                            <Avatar
                                                size="small"
                                                icon={<UserOutlined />}
                                                src={option.data.avatar}
                                                className="bg-blue-100 text-blue-600"
                                            />
                                            <div>
                                                <div className="text-gray-800 font-medium">
                                                    {option.label}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    {option.data.email}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </Form.Item>
                        </Card>
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200">
                            <Title level={5} className="!mb-6 !text-gray-700">Pricing</Title>

                            <div className="space-y-6">
                                {/* Base Price */}
                                <div>
                                    <Text className="!text-gray-600 block mb-2">Base Price</Text>
                                    <Form.Item
                                        name="base_price"
                                        rules={[
                                            { required: true, message: 'Please enter base price' },
                                            { type: 'number', min: 0, message: 'Price must be positive' }
                                        ]}
                                    >
                                        <InputNumber
                                            size="large"
                                            placeholder="0.00"
                                            style={{
                                                width: '100%'
                                            }}
                                            className="w-full custom-input-number"
                                            prefix={<DollarOutlined className="text-gray-400" />}
                                            min={0}
                                            step={0.01}
                                            parser={(value) => value?.replace(/RM\s?|(,*)/g, '') as unknown as number}
                                            formatter={(value) =>
                                                `RM ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            }
                                        />
                                    </Form.Item>
                                </div>

                                {/* Platform Fee */}
                                <div>
                                    <Text className="!text-gray-600 block mb-2">Platform Fee (%)</Text>
                                    <Form.Item
                                        name="platform_fee"
                                        rules={[
                                            { required: true, message: 'Please enter platform fee' },
                                            { type: 'number', min: 0, max: 100, message: 'Fee must be between 0-100%' }
                                        ]}
                                    >
                                        <InputNumber
                                            size="large"
                                            placeholder="10"
                                            className="w-full custom-input-number"
                                            style={{
                                                width: '100%'
                                            }}
                                            prefix={<PercentageOutlined className="text-gray-400" />}
                                            min={0}
                                            max={100}
                                            step={0.5}
                                            parser={(value) => value?.replace('%', '') as unknown as number}
                                            formatter={(value) => `${value}%`}
                                        />
                                    </Form.Item>
                                </div>

                                {/* Final Price Display */}
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <Text className="!text-gray-600">Final Price</Text>
                                        <Title level={4} className="!m-0 !text-green-600">
                                            RM {finalPrice.toFixed(2)}
                                        </Title>
                                    </div>
                                    <Text type="secondary" className="text-sm">
                                        Includes {platformFee}% platform fee
                                    </Text>
                                </div>

                                {/* Duration */}
                                <div>
                                    <Text className="!text-gray-600 block mb-2">Service Duration</Text>
                                    <Form.Item
                                        name="duration_days"
                                        rules={[
                                            { required: true, message: 'Please enter duration' },
                                            { type: 'number', min: 1, max: 365, message: 'Duration must be between 1-365 days' }
                                        ]}
                                    >
                                        <InputNumber
                                            size="large"
                                            placeholder="7"
                                            className="w-full custom-input-number"
                                            suffix="days"
                                            min={1}
                                            max={365}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </Card>

                        {/* Publish Status Card */}
                        <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200">
                            <Title level={5} className="!mb-4 !text-gray-700">Publish Status</Title>
                            <Radio.Group
                                value={publishStatus}
                                onChange={(e) => setPublishStatus(e.target.value)}
                                className="w-full"
                                buttonStyle="solid"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <Radio.Button
                                        value="draft"
                                        className="!h-12 !flex !items-center !justify-center !rounded-lg !border-gray-300 hover:!border-gray-400"
                                    >
                                        <SaveOutlined className="mr-2" />
                                        Save as Draft
                                    </Radio.Button>
                                    <Radio.Button
                                        value="publish"
                                        className="!h-12 !flex !items-center !justify-center !rounded-lg !bg-blue-50 !border-blue-200 !text-blue-600 hover:!bg-blue-100"
                                    >
                                        <CheckOutlined className="mr-2" />
                                        Publish Now
                                    </Radio.Button>
                                </div>
                            </Radio.Group>
                            <Text type="secondary" className="text-sm mt-3 block">
                                {publishStatus === 'draft'
                                    ? 'Save as draft to continue editing later'
                                    : 'Publish will make this service available to clients'}
                            </Text>
                        </Card>

                        {/* Action Buttons */}
                        <div className="sticky top-6">
                            <Card className="border-0 shadow-sm hover:shadow transition-shadow duration-200">
                                <div className="space-y-4">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        size="large"
                                        className="w-full !h-12 !rounded-lg !bg-blue-600 hover:!bg-blue-700"
                                    >
                                        {publishStatus === 'publish' ? 'Publish Service' : 'Save as Draft'}
                                    </Button>
                                    <Button
                                        type="text"
                                        size="large"
                                        className="w-full !h-12 !rounded-lg !text-gray-600 hover:!bg-gray-50"
                                        onClick={() => {
                                            form.resetFields();
                                            setSelectedOfferings([]);
                                            setMainImage(null);
                                            setAdditionalImages([]);
                                            setPublishStatus('draft');
                                        }}
                                    >
                                        Reset Form
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Form>

            <style jsx global>{`
                /* Custom borderless inputs */
                .ant-input-borderless,
                .ant-input-borderless:hover,
                .ant-input-borderless:focus {
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                }

                /* Custom select borderless */
                .ant-select-borderless .ant-select-selector {
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    padding-left: 0 !important;
                }

                /* Custom number input */
                .custom-input-number .ant-input-number-input {
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                }

                .custom-input-number .ant-input-number-handler-wrap {
                    opacity: 0.5;
                }

                .custom-input-number:hover .ant-input-number-handler-wrap {
                    opacity: 1;
                }

                /* Custom offerings select styling */
                .offerings-select .ant-select-selector {
                    min-height: 44px !important;
                    padding: 8px 12px !important;
                    border: 1px solid #d9d9d9 !important;
                    border-radius: 8px !important;
                    background: white !important;
                }

                .offerings-select .ant-select-selector:hover {
                    border-color: #1890ff !important;
                    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1) !important;
                }

                .offerings-select .ant-select-selection-overflow {
                    gap: 8px !important;
                }

                .offerings-select .ant-select-selection-item {
                    margin-inline-end: 0 !important;
                }

                /* Custom dropdown */
                .ant-select-dropdown {
                    border-radius: 8px !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                }

                /* Custom option styling */
                .ant-select-item-option {
                    border-radius: 6px !important;
                    margin: 2px !important;
                }

                .ant-select-item-option:hover {
                    background-color: #f5f5f5 !important;
                }

                .ant-select-item-option-selected {
                    background-color: #e6f7ff !important;
                }

                /* Card hover effects */
                .ant-card {
                    transition: all 0.3s ease !important;
                }

                /* Hide default upload button */
                .ant-upload.ant-upload-select {
                    display: block !important;
                }

                /* Custom radio button groups */
                .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
                    background: #2563eb !important;
                    border-color: #2563eb !important;
                    color: white !important;
                }

                /* Smooth transitions */
                .ant-btn,
                .ant-input,
                .ant-select-selector,
                .ant-checkbox-wrapper,
                .ant-radio-wrapper {
                    transition: all 0.2s ease !important;
                }

                /* Custom scrollbar for dropdown */
                .max-h-\[300px\]::-webkit-scrollbar {
                    width: 6px;
                }

                .max-h-\[300px\]::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .max-h-\[300px\]::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 10px;
                }

                .max-h-\[300px\]::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }

                /* Custom form item labels */
                .ant-form-item-label > label {
                    font-weight: 500 !important;
                    color: #374151 !important;
                }

                /* Custom avatar styling */
                .ant-avatar {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }

                /* Improved dropdown options */
                .ant-select-item-option-content {
                    width: 100% !important;
                }
            `}</style>
        </div>
    );
}