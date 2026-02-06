/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Drawer, Form, Input, InputNumber, Select, Button, message, Space, Upload, Checkbox, Row, Col, Card, Image, Avatar } from "antd";
import { InboxOutlined, FileImageOutlined, UserOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload/interface";
import { Specialist } from "@/types/specialists";
import Stepper, { Step } from "@/../src/components/Stepper";
import { BACKEND_URL } from "@/lib/api";
import { useSession } from "next-auth/react";

interface MultiStepEditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    record: Specialist | null;
    secretaries: any[]; // Adjust type as needed
    onUpdate: (id: string, values: Partial<Specialist>) => Promise<any>;
}

// --- Constants ---
const DURATION_OPTIONS = Array.from({ length: 14 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Day${i + 1 > 1 ? 's' : ''}`
}));

const ADDITIONAL_OFFERINGS = [
    { label: "Company Secretary Subscription (1 month free)", value: "cosecs_sub" },
    { label: "Complimentary Corporate Bank Account Opening", value: "bank_opening" },
    { label: "Access Company Records and SSM Forms", value: "ssm_access" },
    { label: "24/7 Secure Access to Statutory Company Records", value: "secure_access" },
    { label: "Priority Filing (Within 24 hours)", value: "priority_filing" },
    { label: "Registered Office Address Use", value: "reg_address" },
    { label: "Compliance Calendar Setup", value: "compliance_cal" },
    { label: "First Share Certificate Issued Free", value: "share_cert" },
    { label: "CTC Delivery & Courier Handling", value: "ctc_delivery" },
    { label: "Always-On Chat Support", value: "chat_support" },
];

const STEPS_CONFIG = [
    { title: "Service Details", key: "details", fields: ["title", "base_price", "description", "duration_days"] },
    { title: "Media", key: "media", fields: ["image_1", "image_2", "image_3"] },
    { title: "Offerings", key: "offerings", fields: ["additional_offerings"] },
    { title: "Secretary", key: "secretary", fields: ["assigned_secretary_id"] },
    { title: "Review", key: "review", fields: [] },
];

// --- API Helper for Single Image Upload ---
const uploadSingleImage = async (
    file: File,
    fieldName: string,
    specialistId: string,
    order: number,
    token: string
): Promise<{ url: string }> => {
    const formData = new FormData();

    formData.append(fieldName, file);
    formData.append("file_name", file.name);
    formData.append("file_size", file.size.toString());
    formData.append("display_order", order.toString());
    formData.append("mime_type", file.type);
    formData.append("media_type", "profile");
    formData.append("specialist_id", specialistId);

    const response = await fetch(`${BACKEND_URL}/media`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Upload failed");
    }

    return await response.json();
};

export const MultiStepEditDrawer: React.FC<MultiStepEditDrawerProps> = ({
    isOpen,
    onClose,
    record,
    secretaries,
    onUpdate,
}) => {
    console.log(secretaries);
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [originalData, setOriginalData] = useState<Specialist | null>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({
        image_1: '',
        image_2: '',
        image_3: ''
    });
    const [selectedAdditionalOfferings, setSelectedAdditionalOfferings] = useState<string[]>([]);
    const [formInitialized, setFormInitialized] = useState<boolean>(false);
    const [secretaryOptions, setSecretaryOptions] = useState<{ value: string; label: string; user?: any }[]>([]);
    const [currentSecretary, setCurrentSecretary] = useState<{ id: string; name: string; email?: string } | null>(null);

    const { data: session, status } = useSession();

    const formValues = Form.useWatch([], form);
    const isLastStep = currentStep === STEPS_CONFIG.length - 1;

    // Helper to get media URL by display order
    const getMediaUrlByOrder = (media: any[] | undefined, order: number): string => {
        return media?.find(m => m.display_order === order)?.cloudinary_url || '';
    };

    // Format initial images for upload component
    const formatInitialImage = (url: string, uid: string, fieldName: string) => {
        if (!url) return [];
        // Store the original URL for preview
        setImageUrls(prev => ({ ...prev, [fieldName]: url }));

        return [{
            uid: uid,
            name: 'existing-image.png',
            status: 'done',
            url: url,
            isExisting: true // Custom flag to identify existing images
        }];
    };

    // Load secretaries
    useEffect(() => {
        const loadSecretaries = async () => {
            try {
                console.log("=== LOADED SECRETARIES ===", secretaries);

                if (secretaries && Array.isArray(secretaries)) {
                    const options = secretaries.map(secretary => ({
                        value: secretary.user.id,
                        label: `${secretary.user?.full_name || 'Unknown'} (${secretary.user?.email || 'No email'})`,
                        user: secretary.user
                    }));
                    setSecretaryOptions(options);

                    // Find current secretary if exists
                    if (record?.assigned_secretary_id) { // FIXED: Added optional chaining
                        const current = secretaries.find(s => s.id === record.assigned_secretary_id);
                        if (current) {
                            setCurrentSecretary({
                                id: current.user.id,
                                name: current.user?.name || 'Unknown',
                                email: current.user?.email
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("=== ERROR LOADING SECRETARIES ===", error);
                message.error("Failed to load secretaries");
            }
        };

        if (isOpen && record) { // FIXED: Added record check
            loadSecretaries();
        }
    }, [isOpen, record, secretaries]); // FIXED: Added record dependency

    // Initialize form with record data - RUNS ONLY ONCE
    useEffect(() => {
        if (record && isOpen && !formInitialized) {
            console.log("=== INITIALIZING FORM WITH RECORD ===", record);
            setOriginalData(record);

            // Get initial image URLs
            const media = record.media as any[];
            const image1Url = getMediaUrlByOrder(media, 1);
            const image2Url = getMediaUrlByOrder(media, 2);
            const image3Url = getMediaUrlByOrder(media, 3);

            // Set image URLs state
            setImageUrls({
                image_1: image1Url,
                image_2: image2Url,
                image_3: image3Url
            });

            // Process additional offerings - ensure it's always an array
            let initialOfferings: string[] = [];

            if (record.additional_offerings) {
                if (Array.isArray(record.additional_offerings)) {
                    initialOfferings = record.additional_offerings;
                } else if (typeof record.additional_offerings === 'string') {
                    // Try to parse if it's a JSON string
                    try {
                        const parsed = JSON.parse(record.additional_offerings);
                        initialOfferings = Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                        // If not JSON, treat as a single value
                        initialOfferings = [record.additional_offerings];
                    }
                }
            }

            console.log("=== INITIAL ADDITIONAL OFFERINGS ===", initialOfferings);
            setSelectedAdditionalOfferings(initialOfferings);

            // Prepare initial values for form
            const initialValues = {
                title: record.title || '',
                base_price: record.base_price || 0,
                description: record.description || '',
                duration_days: record.duration_days || 1,
                additional_offerings: initialOfferings,
                assigned_secretary_id: record.assigned_secretary_id || null,
                image_1: formatInitialImage(image1Url, '-1', 'image_1'),
                image_2: formatInitialImage(image2Url, '-2', 'image_2'),
                image_3: formatInitialImage(image3Url, '-3', 'image_3'),
            };

            console.log("=== SETTING INITIAL FORM VALUES ===", initialValues);

            // Use setTimeout to ensure form is ready
            setTimeout(() => {
                form.setFieldsValue(initialValues);
                setPreviewData(initialValues);
                setFormInitialized(true);
            }, 100);

        } else if (!isOpen) {
            // Reset everything when drawer closes
            setCurrentStep(0);
            setOriginalData(null);
            setPreviewData(null);
            setSelectedAdditionalOfferings([]);
            setCurrentSecretary(null);
            setSecretaryOptions([]);
            setImageUrls({ image_1: '', image_2: '', image_3: '' });
            setFormInitialized(false);
            form.resetFields();
        }
    }, [record, isOpen, form, formInitialized]);

    // Update preview data when form values change
    useEffect(() => {
        if (formValues && Object.keys(formValues).length > 0) {
            console.log("=== FORM VALUES CHANGED ===", formValues);
            console.log("=== ADDITIONAL OFFERINGS IN FORM ===", formValues.additional_offerings);
            console.log("=== ASSIGNED SECRETARY IN FORM ===", formValues.assigned_secretary_id);

            // Update selectedAdditionalOfferings when form values change
            if (formValues.additional_offerings !== undefined) {
                const offerings = Array.isArray(formValues.additional_offerings)
                    ? formValues.additional_offerings
                    : (formValues.additional_offerings ? [formValues.additional_offerings] : []);
                setSelectedAdditionalOfferings(offerings);
            }

            // Update current secretary info when assigned_secretary_id changes
            if (formValues.assigned_secretary_id && secretaryOptions.length > 0) {
                const selectedSecretary = secretaryOptions.find(
                    option => option.value === formValues.assigned_secretary_id
                );
                if (selectedSecretary) {
                    setCurrentSecretary({
                        id: selectedSecretary.user.value,
                        name: selectedSecretary.user?.full_name || selectedSecretary.label,
                        email: selectedSecretary.user?.email
                    });
                }
            } else if (!formValues.assigned_secretary_id) {
                setCurrentSecretary(null);
            }

            setPreviewData(formValues);
        }
    }, [formValues, secretaryOptions]);

    // Handle checkbox change
    const handleAdditionalOfferingsChange = (checkedValues: any[]) => {
        console.log("=== CHECKBOX VALUES CHANGED ===", checkedValues);
        const values = Array.isArray(checkedValues) ? checkedValues : [];
        setSelectedAdditionalOfferings(values);

        // Update form value immediately
        form.setFieldsValue({
            additional_offerings: values
        });

        // Force update preview data
        const currentFormValues = form.getFieldsValue();
        setPreviewData({
            ...currentFormValues,
            additional_offerings: values
        });
    };

    const handleNext = async () => {
        try {
            const fieldsToValidate = STEPS_CONFIG[currentStep].fields;

            // Get current form values before validation
            const currentValues = form.getFieldsValue();
            console.log("=== CURRENT FORM VALUES BEFORE VALIDATION ===", currentValues);

            await form.validateFields(fieldsToValidate);

            // Ensure additional_offerings is preserved
            if (currentStep === 2) { // If we're leaving the offerings step
                const offerings = form.getFieldValue('additional_offerings');
                if (offerings !== undefined) {
                    setSelectedAdditionalOfferings(Array.isArray(offerings) ? offerings : []);
                }
            }

            setCurrentStep((prev) => prev + 1);
        } catch (error) {
            console.error("=== VALIDATION ERROR ===", error);
            message.error("Please complete all required fields.");
        }
    };

    const handlePrev = () => {
        // Get current form values before moving back
        const currentValues = form.getFieldsValue();
        console.log("=== FORM VALUES BEFORE GOING BACK ===", currentValues);

        // Ensure additional_offerings is preserved
        if (currentValues.additional_offerings !== undefined) {
            setSelectedAdditionalOfferings(
                Array.isArray(currentValues.additional_offerings)
                    ? currentValues.additional_offerings
                    : []
            );
        }

        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        if (!record || !originalData || !session?.accessToken) {
            message.error("Missing required data or session");
            return;
        }

        setSubmitting(true);
        try {
            // Get ALL form values
            const values = form.getFieldsValue(true);
            console.log("=== ALL FORM VALUES FOR SUBMISSION ===", values);
            console.log("=== SELECTED ADDITIONAL OFFERINGS ===", selectedAdditionalOfferings);
            console.log("=== ORIGINAL DATA ===", originalData);

            // Create clean values object
            const cleanValues: Partial<Specialist> = {};

            // Add all editable fields
            cleanValues.title = values.title || originalData.title;
            cleanValues.base_price = values.base_price || originalData.base_price;
            cleanValues.description = values.description || originalData.description;
            cleanValues.duration_days = values.duration_days || originalData.duration_days;
            cleanValues.assigned_secretary_id = values.assigned_secretary_id || null;

            // Use the selectedAdditionalOfferings state variable (it should always be current)
            cleanValues.additional_offerings = selectedAdditionalOfferings;

            console.log("=== CLEAN ADDITIONAL OFFERINGS ===", cleanValues.additional_offerings);
            console.log("=== CLEAN ASSIGNED SECRETARY ===", cleanValues.assigned_secretary_id);

            // Process image fields
            const processImageField = (fieldValue: any[], fieldName: string) => {
                if (Array.isArray(fieldValue) && fieldValue.length > 0) {
                    const file = fieldValue[0];
                    // If it's an existing image (not uploaded), return the original URL
                    if (file.isExisting) {
                        console.log(`Image ${fieldName}: Using existing image`, imageUrls[fieldName]);
                        return imageUrls[fieldName] || '';
                    }
                    // If new upload, get the new URL
                    const newUrl = file.url || file.response?.url || '';
                    console.log(`Image ${fieldName}: Using new upload`, newUrl);
                    return newUrl;
                }
                // If field is empty but had original image, keep original
                const originalUrl = imageUrls[fieldName] || "";
                console.log(`Image ${fieldName}: Field empty, using original`, originalUrl);
                return originalUrl;
            };

            // Add image URLs to cleanValues
            cleanValues.image_1 = processImageField(values.image_1 || [], 'image_1');
            cleanValues.image_2 = processImageField(values.image_2 || [], 'image_2');
            cleanValues.image_3 = processImageField(values.image_3 || [], 'image_3');

            // Add other fields that should be preserved
            // cleanValues.category = originalData.category;
            // cleanValues.sub_category = originalData.sub_category;
            cleanValues.slug = originalData.slug;
            // cleanValues.status = originalData.status;
            // cleanValues.featured = originalData.featured;
            // cleanValues.order_count = originalData.order_count;
            // cleanValues.rating = originalData.rating;

            // Log final cleanValues
            console.log("=== FINAL CLEAN VALUES ===", cleanValues);
            console.log("=== CLEAN VALUES AS JSON ===", JSON.stringify(cleanValues, null, 2));

            try {
                // Use direct fetch
                const response = await fetch(`${BACKEND_URL}/specialists/${record.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session.accessToken}`,
                    },
                    body: JSON.stringify(cleanValues),
                });

                console.log("=== RESPONSE STATUS ===", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("=== ERROR RESPONSE ===", errorText);
                    throw new Error(`Update failed: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                console.log("=== UPDATE SUCCESS ===", result);
                message.success("Service updated successfully");
                onClose();

                // Also call the onUpdate callback if provided
                if (onUpdate) {
                    await onUpdate(record.id, cleanValues);
                }
            } catch (error) {
                console.error("=== UPDATE ERROR DETAILS ===", error);
                message.error(error instanceof Error ? error.message : "Failed to update service.");
            }
        } catch (error) {
            console.error("=== SUBMISSION ERROR DETAILS ===", error);
            message.error(error instanceof Error ? error.message : "Failed to submit form.");
        } finally {
            setSubmitting(false);
        }
    };

    // Dynamic Upload Props
    const customRequestProps = (fieldName: string): UploadProps => ({
        name: fieldName,
        maxCount: 1,
        listType: "picture-card",
        showUploadList: { showPreviewIcon: false },
        beforeUpload: (file) => {
            if (status === "loading") {
                message.loading("Verifying session...");
                return Upload.LIST_IGNORE;
            }
            if (!session?.accessToken) {
                message.error("You must be logged in to upload images.");
                return Upload.LIST_IGNORE;
            }

            const isSupported = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            if (!isSupported) message.error('You can only upload JPG/PNG/WEBP files!');
            const isLt4M = file.size / 1024 / 1024 < 4;
            if (!isLt4M) message.error('Image must be smaller than 4MB!');
            return isSupported && isLt4M;
        },
        customRequest: async ({ file, onSuccess, onError }) => {
            if (!record?.id) {
                message.error("Specialist ID is missing");
                return onError?.(new Error("No ID"));
            }

            const token = session?.accessToken;
            if (!token) {
                message.error("Session expired. Please log in again.");
                return onError?.(new Error("Unauthorized"));
            }

            try {
                const order = parseInt(fieldName.split('_')[1]) || 1;
                const result = await uploadSingleImage(
                    file as File,
                    fieldName,
                    record.id,
                    order,
                    token
                );

                // Update image URL for preview
                setImageUrls(prev => ({ ...prev, [fieldName]: result.url }));

                onSuccess?.(result, file as any);
                message.success(`${fieldName} uploaded successfully`);
            } catch (err: any) {
                onError?.(err);
                message.error(err.message || "Upload failed");
            }
        },
        onChange: ({ fileList }) => {
            form.setFieldValue(fieldName, fileList);
        },
        onRemove: () => {
            // Clear the image URL when removed
            setImageUrls(prev => ({ ...prev, [fieldName]: '' }));
        }
    });

    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const UploadSlot = ({ name, label }: { name: string, label: string }) => (
        <Form.Item
            name={name}
            label={label}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="mb-6"
        >
            <Upload.Dragger {...customRequestProps(name)} height={120} style={{ padding: '20px' }}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-blue-500" />
                </p>
                <p className="ant-upload-text text-sm">Drag & Drop or Click to Upload</p>
                <p className="ant-upload-hint text-xs text-gray-400">JPG, PNG or WEBP (Max 4MB)</p>
            </Upload.Dragger>
        </Form.Item>
    );

    // Helper function to get preview image URL
    const getPreviewImageUrl = (fieldName: string): string => {
        const fieldValue = previewData?.[fieldName];

        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
            const file = fieldValue[0];
            // If it's an existing image
            if (file.isExisting) {
                return imageUrls[fieldName] || '';
            }
            // If new upload
            return file.url || file.response?.url || file.thumbUrl || '';
        }

        // Return stored URL for removed or unchanged images
        return imageUrls[fieldName] || '';
    };

    // Get selected offerings labels for preview
    const getSelectedOfferingsLabels = (): string[] => {
        return selectedAdditionalOfferings.map(value => {
            const offering = ADDITIONAL_OFFERINGS.find(item => item.value === value);
            return offering ? offering.label : value;
        });
    };

    // Get secretary name by ID for preview
    const getSecretaryNameById = (id: string): string => {
        const secretary = secretaryOptions.find(option => option.value === id);
        return secretary ? secretary.label : 'Not assigned';
    };

    // Render step content based on current step
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Service Details
                return (
                    <Form form={form} layout="vertical" preserve={true} requiredMark="optional">
                        <Form.Item
                            name="title"
                            label="Service Title"
                            rules={[{ required: true, message: 'Please enter a title' }]}
                        >
                            <Input placeholder="Enter title" size="large" />
                        </Form.Item>
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="base_price"
                                label="Price"
                                rules={[{ required: true, message: 'Please enter price' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    className="w-full"
                                    min={0}
                                    precision={2}
                                    addonBefore="MYR"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                name="duration_days"
                                label="Completion Time"
                                rules={[{ required: true, message: 'Please select duration' }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Select days"
                                    options={DURATION_OPTIONS}
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter description' }]}
                        >
                            <Input.TextArea rows={5} showCount maxLength={500} />
                        </Form.Item>
                    </Form>
                );

            case 1: // Media
                return (
                    <Form form={form} layout="vertical" preserve={true}>
                        <div className="bg-blue-50 p-3 rounded mb-4 text-blue-700 text-sm">
                            <FileImageOutlined className="mr-2" />
                            Upload up to 3 images. They are saved individually on upload.
                        </div>
                        <UploadSlot name="image_1" label="Service Image (1st) - Main" />
                        <div className="grid grid-cols-2 gap-4">
                            <UploadSlot name="image_2" label="Service Image (2nd)" />
                            <UploadSlot name="image_3" label="Service Image (3rd)" />
                        </div>
                    </Form>
                );

            case 2: // Offerings
                return (
                    <Form form={form} layout="vertical" preserve={true}>
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800">Additional Offerings</h3>
                            <p className="text-sm text-gray-500">Select all that apply</p>
                        </div>
                        <Form.Item
                            name="additional_offerings"
                            initialValue={selectedAdditionalOfferings}
                        >
                            <Checkbox.Group
                                className="w-full"
                                value={selectedAdditionalOfferings}
                                onChange={handleAdditionalOfferingsChange}
                            >
                                <Row gutter={[16, 16]}>
                                    {ADDITIONAL_OFFERINGS.map((offer) => (
                                        <Col span={24} key={offer.value}>
                                            <Card size="small" className="hover:border-blue-400" bodyStyle={{ padding: '12px' }}>
                                                <Checkbox value={offer.value} className="w-full">
                                                    {offer.label}
                                                </Checkbox>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </Form>
                );

            case 3: // Secretary Assignment
                return (
                    <Form form={form} layout="vertical" preserve={true}>
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800">Assign Company Secretary</h3>
                            <p className="text-sm text-gray-500">
                                Select a company secretary to handle this service. This person will be responsible for all compliance matters.
                            </p>
                        </div>

                        {/* Current Secretary Info */}
                        {originalData?.assigned_secretary_id && currentSecretary && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-700 mb-2">Currently Assigned Secretary</h4>
                                <div className="flex items-center space-x-3">
                                    <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
                                    <div>
                                        <p className="font-medium">{currentSecretary.name}</p>
                                        {currentSecretary.email && (
                                            <p className="text-sm text-gray-500">{currentSecretary.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Form.Item
                            name="assigned_secretary_id"
                            label="Select Secretary"
                            help="Leave empty to remove current assignment"
                        >
                            <Select
                                placeholder="Select a company secretary"
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                size="large"
                                loading={secretaryOptions.length === 0}
                                options={[
                                    { value: null, label: "No Secretary (Unassigned)" },
                                    ...secretaryOptions
                                ]}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        {secretaryOptions.length === 0 && (
                                            <div className="p-2 text-center text-gray-500">
                                                Loading secretaries...
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                        </Form.Item>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">About Secretary Assignment</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• The assigned secretary will handle all compliance filings</li>
                                <li>• Clients will communicate directly with the assigned secretary</li>
                                <li>• You can change or remove assignment at any time</li>
                                <li>• If unassigned, service will be handled by available secretaries</li>
                            </ul>
                        </div>
                    </Form>
                );

            case 4: // Review
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <h4 className="font-bold text-blue-700 mb-2">Review Your Changes</h4>
                            <p className="text-sm text-blue-600">
                                All data will be sent to ensure complete update.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold border-b pb-2 mb-3">Service Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                <div>
                                    <span className="text-gray-500 block text-xs">Title</span>
                                    <span className="font-medium">{previewData?.title || originalData?.title || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-xs">Price</span>
                                    <span className="font-medium">MYR {previewData?.base_price || originalData?.base_price || '0.00'}</span>
                                </div>
                            </div>
                            <div className="text-sm mb-3">
                                <span className="text-gray-500 block text-xs">Duration</span>
                                <span className="font-medium">
                                    {previewData?.duration_days || originalData?.duration_days
                                        ? `${previewData?.duration_days || originalData?.duration_days} Day${(previewData?.duration_days || originalData?.duration_days) > 1 ? 's' : ''}`
                                        : '-'}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-500 block text-xs">Description</span>
                                <p className="mt-1 p-2 bg-white rounded border min-h-15">
                                    {previewData?.description || originalData?.description || '-'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold border-b pb-2 mb-3">Additional Offerings</h4>
                            <div className="space-y-2">
                                {selectedAdditionalOfferings.length > 0 ? (
                                    getSelectedOfferingsLabels().map((label, index) => (
                                        <div key={index} className="flex items-center p-2 rounded bg-blue-50">
                                            <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                                            <span className="text-sm">{label}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No additional offerings selected
                                    </div>
                                )}
                                <div className="mt-3 text-xs text-gray-400">
                                    Total selected: {selectedAdditionalOfferings.length} of {ADDITIONAL_OFFERINGS.length}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold border-b pb-2 mb-3">Secretary Assignment</h4>
                            <div className="space-y-2">
                                {previewData?.assigned_secretary_id ? (
                                    <div className="flex items-center p-3 bg-blue-50 rounded">
                                        <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600 mr-3" />
                                        <div>
                                            <p className="font-medium">
                                                {getSecretaryNameById(previewData.assigned_secretary_id)}
                                            </p>
                                            <p className="text-xs text-gray-500">Secretary ID: {previewData.assigned_secretary_id}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No secretary assigned
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold border-b pb-2 mb-3">Service Images</h4>
                            <div className="flex gap-3 flex-wrap">
                                {['image_1', 'image_2', 'image_3'].map((fieldName, idx) => {
                                    const previewUrl = getPreviewImageUrl(fieldName);
                                    const label = idx === 0 ? 'Main Image' : `Image ${idx + 1}`;

                                    return (
                                        <div key={fieldName} className="flex flex-col items-center">
                                            <div className="w-28 h-28 bg-white border border-gray-300 flex items-center justify-center rounded-md overflow-hidden mb-1">
                                                {previewUrl ? (
                                                    <Image
                                                        src={previewUrl}
                                                        alt={label}
                                                        className="object-cover w-full h-full"
                                                        preview={false}
                                                    />
                                                ) : (
                                                    <span className="text-xs text-gray-400">No Image</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">{label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Drawer
            title={<span className="text-lg font-bold">Edit Service</span>}
            open={isOpen}
            onClose={onClose}
            width={600}
            zIndex={2000}
            styles={{
                body: {
                    paddingBottom: 80,
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 180px)'
                }
            }}
            footer={
                <div className="flex justify-between px-4 py-2 bg-white border-t">
                    <Button
                        onClick={handlePrev}
                        disabled={currentStep === 0 || submitting}
                    >
                        Back
                    </Button>
                    <Space>
                        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                        {isLastStep ? (
                            <Button type="primary" onClick={handleSubmit} loading={submitting}>
                                Publish Changes
                            </Button>
                        ) : (
                            <Button type="primary" onClick={handleNext}>Next</Button>
                        )}
                    </Space>
                </div>
            }
        >
            <Stepper activeStep={currentStep}>
                <Step />
                <Step />
                <Step />
                <Step />
                <Step />
            </Stepper>

            {/* Render the form content based on current step */}
            <div className="mt-6">
                {renderStepContent()}
            </div>
        </Drawer>
    );
};