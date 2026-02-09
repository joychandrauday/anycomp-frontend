'use client';

import { useState } from 'react';
import { Form, Input, Button, Upload, message, Select, Card } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { UploadFile } from 'antd/es/upload/interface';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('full_name', values.full_name);
            formData.append('role', 'viewer');
            formData.append('password', values.password);

            if (fileList.length > 0) {
                formData.append(
                    'profile_image',
                    fileList[0].originFileObj as File
                );
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                {
                    method: 'POST',
                    body: formData, // ✅ NOT JSON.stringify
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            message.success('Registration successful! Welcome aboard! 🎉');
        } catch (err: any) {
            message.error(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: '#f9fafb',
        },
        card: {
            width: '100%',
            maxWidth: '1200px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        },
        banner: {
            position: 'relative' as const,
            minHeight: '300px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flex: 1,
        },
        overlay: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(15,32,39,0.85) 0%, rgba(32,58,67,0.8) 50%, rgba(44,83,100,0.75) 100%)',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            padding: '32px',
            textAlign: 'center' as const,
        },
        formContainer: {
            flex: 1,
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        formWrapper: {
            width: '100%',
            maxWidth: '400px',
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
        },
        subtitle: {
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px',
        },
        alert: {
            backgroundColor: '#e0f2fe',
            border: '1px solid #7dd3fc',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
        },
        terms: {
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center' as const,
            marginTop: '12px',
        },
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={styles.card}
            >
                <Card bodyStyle={{ padding: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', md: { flexDirection: 'row' } } as any}>
                        {/* LEFT SIDE - BANNER */}
                        <div style={styles.banner}>
                            <div style={styles.overlay}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    style={{ maxWidth: '400px' }}
                                >
                                    <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px' }}>
                                        Join Our Community
                                    </h1>
                                    <p style={{ fontSize: '18px', marginBottom: '24px', opacity: 0.9 }}>
                                        Connect with professionals and grow your business in our vibrant ecosystem
                                    </p>
                                    <div style={{ marginTop: '32px' }}>
                                        <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>
                                            Already have an account?
                                        </p>
                                        <Button
                                            type="link"
                                            href="/login"
                                            size="large"
                                            style={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                            }}
                                        >
                                            Sign In Here →
                                        </Button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - REGISTRATION FORM */}
                        <div style={styles.formContainer}>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                style={styles.formWrapper}
                            >
                                <div style={{ marginBottom: '24px' }}>
                                    <h2 style={styles.title}>Create Account</h2>
                                    <p style={styles.subtitle}>Fill in your details to get started</p>
                                </div>



                                <Form
                                    layout="vertical"
                                    onFinish={onFinish}
                                    size="large"
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' },
                                        ]}
                                        style={{ marginBottom: '16px' }}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="Email address"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="full_name"
                                        rules={[{ required: true, message: 'Please enter your full name' }]}
                                        style={{ marginBottom: '16px' }}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Full name"
                                        />
                                    </Form.Item>


                                    <Form.Item
                                        name="password"
                                        rules={[
                                            { required: true, message: 'Please enter your password' },
                                            { min: 8, message: 'Password must be at least 8 characters' },
                                        ]}
                                        style={{ marginBottom: '16px' }}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Password (min. 8 characters)"
                                            defaultValue="secret@123456"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Profile Picture (Optional)"
                                        style={{ marginBottom: '24px' }}
                                    >
                                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                                            Upload a profile picture to help others recognize you
                                        </div>
                                        <Upload
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            fileList={fileList}
                                            onChange={({ fileList }) => setFileList(fileList)}
                                            listType="picture"
                                            accept="image/*"
                                        >
                                            <Button
                                                icon={<UploadOutlined />}
                                                style={{ width: '100%', textAlign: 'left' }}
                                            >
                                                Click to upload
                                            </Button>
                                        </Upload>
                                    </Form.Item>

                                    <Form.Item style={{ marginBottom: '24px' }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            style={{
                                                width: '100%',
                                                height: '48px',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {loading ? 'Creating Account...' : 'Create Account'}
                                        </Button>
                                    </Form.Item>

                                    <div style={styles.terms}>
                                        By registering, you agree to our{' '}
                                        <a href="/terms" style={{ color: '#2563eb', textDecoration: 'none' }}>
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="/privacy" style={{ color: '#2563eb', textDecoration: 'none' }}>
                                            Privacy Policy
                                        </a>
                                    </div>
                                </Form>
                            </motion.div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default RegisterPage;