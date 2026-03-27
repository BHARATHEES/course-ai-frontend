import React from 'react';
import './Card.css';

/**
 * Card Component - Container for content
 */
export const Card = ({ children, className = '' }) => {
  return <div className={`card ${className}`}>{children}</div>;
};

/**
 * CardHeader Component - Header section of card
 */
export const CardHeader = ({ children, className = '' }) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

/**
 * CardTitle Component - Title within card header
 */
export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`card-title ${className}`}>{children}</h3>;
};

/**
 * CardContent Component - Main content section of card
 */
export const CardContent = ({ children, className = '' }) => {
  return <div className={`card-content ${className}`}>{children}</div>;
};

export default Card;
