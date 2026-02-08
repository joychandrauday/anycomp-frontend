'use client';

import { CheckCircleOutlined, StarFilled, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface SearchCardProps {
    service: any;
}

export default function SearchCard({ service }: SearchCardProps) {
    // Function to render star ratings
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <StarFilled
                key={index}
                style={{
                    color: index < Math.floor(rating) ? '#FFC107' : '#E0E0E0',
                    fontSize: '14px',
                    marginRight: '2px'
                }}
            />
        ));
    };

    return (
        <div
            style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
            }}
        >
            <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                {/* Service Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                }}>
                    <div style={{ flex: '1', marginRight: '12px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <div style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                fontWeight: '500',
                                fontSize: '12px',
                                padding: '4px 8px',
                                borderRadius: '16px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                border: 'none'
                            }}>
                                <CheckCircleOutlined style={{
                                    fontSize: '12px',
                                    marginRight: '4px'
                                }} />
                                Verified
                            </div>
                        </div>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '4px',
                            lineHeight: '1.4'
                        }}>
                            {service.title}
                        </h3>
                        {service.specialist_name && (
                            <p style={{
                                color: '#64748b',
                                fontSize: '14px',
                                margin: '0',
                                lineHeight: '1.5'
                            }}>
                                {service.specialist_name}
                            </p>
                        )}
                    </div>

                    {/* Price Display */}
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#3b82f6',
                            lineHeight: '1.2'
                        }}>
                            RM {service.final_price || service.base_price}
                        </div>
                        {service.original_price && service.original_price > (service.final_price || service.base_price) && (
                            <div style={{
                                fontSize: '14px',
                                color: '#94a3b8',
                                textDecoration: 'line-through',
                                lineHeight: '1.2',
                                marginTop: '2px'
                            }}>
                                ${service.original_price}
                            </div>
                        )}
                    </div>
                </div>

                {/* Specialist Info */}
                {service.assigned_secretary && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#f1f5f9',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '18px',
                            marginRight: '12px',
                            flexShrink: 0
                        }}>
                            {service.assigned_secretary.full_name?.[0] || <UserOutlined />}
                        </div>
                        <div style={{ flex: '1', minWidth: 0 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{ marginRight: '8px' }}>
                                    <p style={{
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        marginBottom: '4px',
                                        fontSize: '14px',
                                        lineHeight: '1.4'
                                    }}>
                                        {service.assigned_secretary.full_name}
                                    </p>
                                    <p style={{
                                        color: '#64748b',
                                        fontSize: '12px',
                                        marginBottom: '0',
                                        lineHeight: '1.4'
                                    }}>
                                        {service.assigned_secretary.experience || 'Experienced'} Company Secretary
                                    </p>
                                </div>
                                <a
                                    href="#"
                                    style={{
                                        color: '#3b82f6',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    View Profile
                                </a>
                            </div>
                            {service.assigned_secretary.clients_served && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '8px',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{
                                        backgroundColor: '#e0f2fe',
                                        color: '#0369a1',
                                        fontSize: '12px',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontWeight: '500',
                                        display: 'inline-block',
                                        marginBottom: '4px'
                                    }}>
                                        {service.assigned_secretary.clients_served} clients
                                    </span>
                                    {service.assigned_secretary.location && (
                                        <span style={{
                                            color: '#64748b',
                                            fontSize: '12px',
                                            marginLeft: '12px',
                                            display: 'inline-block',
                                            marginBottom: '4px'
                                        }}>
                                            {service.assigned_secretary.location}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Service Description */}
                <div style={{ marginBottom: '16px', flex: '1' }}>
                    <p style={{
                        color: '#475569',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        marginBottom: '16px'
                    }}>
                        {service.description}
                    </p>

                    {/* Additional Offerings */}
                    {service.additional_offerings && service.additional_offerings.length > 0 && (
                        <div>
                            <p style={{
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '8px',
                                fontSize: '14px',
                                lineHeight: '1.4'
                            }}>
                                Included in this service:
                            </p>
                            <ul style={{
                                paddingLeft: '16px',
                                marginBottom: '0',
                                listStyleType: 'none'
                            }}>
                                {service.additional_offerings.map((item: string, idx: number) => (
                                    <li key={idx} style={{
                                        color: '#475569',
                                        fontSize: '14px',
                                        marginBottom: '6px',
                                        lineHeight: '1.5',
                                        position: 'relative',
                                        paddingLeft: '16px'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: '8px',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: '#3b82f6'
                                        }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Rating and Timeline */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '16px',
                    marginTop: 'auto',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '4px'
                        }}>
                            {renderStars(service.average_rating || 0)}
                            <span style={{
                                marginLeft: '8px',
                                fontWeight: '600',
                                color: '#1e293b',
                                fontSize: '14px'
                            }}>
                                {service.average_rating || 'N/A'}
                            </span>
                        </div>
                        <p style={{
                            color: '#64748b',
                            fontSize: '12px',
                            margin: '0',
                            lineHeight: '1.4'
                        }}>
                            ({service.total_number_of_ratings || 0} reviews)
                        </p>
                    </div>

                    {/* Processing Time */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <ClockCircleOutlined style={{
                            color: '#3b82f6',
                            marginRight: '6px',
                            fontSize: '14px'
                        }} />
                        <span style={{
                            color: '#1e293b',
                            fontSize: '14px',
                            fontWeight: '500',
                            lineHeight: '1.4'
                        }}>
                            {service.processing_time || '3-5'} business days
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    style={{
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        marginTop: '20px',
                        height: '44px',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#3b82f6';
                    }}
                 onClick={() => window.location.replace(`/service/${service.slug}`)}
                >
                    Appoint & Register
                </button>
            </div>
        </div>
    );
}