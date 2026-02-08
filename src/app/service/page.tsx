import SearchCard from '@/components/Specialist/SearchCard';
import { specialistService } from '@/services/specialistService';
import { Col, Row } from 'antd';
import React from 'react';



export default async function Page() {

    const response = await specialistService.getAll();
    const services = response?.data || [];

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>


            <Row gutter={[24, 24]}>
                {services.map((service: any) => (
                    <Col key={service.id} xs={24} sm={24} md={12} lg={8}>
                        <SearchCard service={service} />
                    </Col>
                ))}
            </Row>

            {services.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px dashed #e2e8f0',
                    marginTop: '20px'
                }}>
                    <h3 style={{
                        color: '#64748b',
                        marginBottom: '12px',
                        fontSize: '20px',
                        fontWeight: '600'
                    }}>
                        No services found
                    </h3>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: '16px'
                    }}>
                        Try adjusting your search terms or browse our full catalog
                    </p>
                </div>
            )}
        </div>
    );
}