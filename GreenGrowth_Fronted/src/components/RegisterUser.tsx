import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

// --- Type Definitions ---
interface IFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ApiError {
    message: string;
}

// --- SVG Icon Components (Typed as React Functional Components) ---
const UserIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>;
const EmailIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586z"/></svg>;
const LockIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/></svg>;
const ErrorIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>;


// --- Main Registration Component ---
const RegisterUser: React.FC = () => {
    const [formData, setFormData] = useState<IFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const { username, email, password, confirmPassword } = formData;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            const newUser = {
                username,
                email,
                password,
            };
            
            const API_URL = 'http://127.0.0.1:5001/users/register';
            await axios.post(API_URL, newUser);

            setSuccess(true);
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });

            // Redirect user after a short delay
            setTimeout(() => { window.location.href = '/login'; }, 1500);

        } catch (err) {
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (axios.isAxiosError(err)) {
                // Now we can safely access err.response
                const serverError = err.response?.data as ApiError;
                if (serverError && serverError.message) {
                    errorMessage = serverError.message;
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formWrapper}>
                <h1 style={styles.header}>Create New User</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.card}>
                        {/* Full Name Input */}
                        <div style={styles.inputGroup}>
                            <label htmlFor="username" style={styles.label}>Username</label>
                            <div style={styles.inputContainer}>
                                <span style={styles.icon}><UserIcon /></span>
                                <input type="text" id="username" name="username" value={username} onChange={handleChange} placeholder="Enter your full name" style={styles.input} required />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>Email Address</label>
                            <div style={styles.inputContainer}>
                                <span style={styles.icon}><EmailIcon /></span>
                                <input type="email" id="email" name="email" value={email} onChange={handleChange} placeholder="Enter your email" style={styles.input} required />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div style={styles.inputGroup}>
                            <label htmlFor="password" style={styles.label}>Password</label>
                            <div style={styles.inputContainer}>
                                <span style={styles.icon}><LockIcon /></span>
                                <input type="password" id="password" name="password" value={password} onChange={handleChange} placeholder="Enter your password" style={styles.input} required />
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div style={styles.inputGroup}>
                            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                            <div style={styles.inputContainer}>
                                <span style={styles.icon}><LockIcon /></span>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChange} placeholder="Confirm your password" style={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <div style={styles.errorBox}>
                            <ErrorIcon />
                            <div style={{ marginLeft: '10px' }}>
                                <p style={styles.errorTitle}>Registration Error</p>
                                <p style={styles.errorMessage}>{error}</p>
                            </div>
                        </div>
                    )}
                    
                    {success && (
                        <div style={styles.successBox}>
                             <p style={styles.successMessage}>✅ User successfully registered!</p>
                        </div>
                    )}

                    <button type="submit" style={styles.submitButton} disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Link to Login */}
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <p style={{ fontSize: '14px', color: '#718096' }}>
                            Already have an account?{' '}
                            <a href="/login" style={{ color: '#9cdb5f', textDecoration: 'underline' }}>
                                Sign in here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- CSS-in-JS Styling (Typed) ---
const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        background: 'linear-gradient(to bottom, #f0f9f6, #ffffff)',
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    formWrapper: {
        width: '100%',
        maxWidth: '500px',
    },
    header: {
        fontSize: '28px',
        fontWeight: 600,
        color: '#2d3748',
        marginBottom: '24px',
    },
    form: {
        width: '100%',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: 500,
        color: '#4a5568',
        marginBottom: '8px',
    },
    inputContainer: {
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#a0aec0',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        fontSize: '16px',
        border: '1px solid #cbd5e0',
        borderRadius: '8px',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    submitButton: {
        width: '100%',
        padding: '14px',
        fontSize: '16px',
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#9cdb5f',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFF1F2',
        color: '#E53E3E',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid #FECACA',
    },
    errorTitle: {
        margin: 0,
        fontWeight: 600,
        fontSize: '16px',
    },
    errorMessage: {
        margin: '4px 0 0',
        fontSize: '14px',
    },
    successBox: {
        backgroundColor: '#F0FFF4',
        color: '#38A169', 
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid #9AE6B4',
    },
    successMessage: {
        margin: 0,
        fontWeight: 500,
    },
};

// --- Global Styles for Pseudo-classes ---
// Inject this into your application's global stylesheet or use a CSS-in-JS library like Emotion or Styled-components.
const globalStyles = `
    input:focus {
        outline: none;
        border-color: #10B981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }
    button[type="submit"]:hover {
        background-color: #059669;
    }
    button[type="submit"]:disabled {
        background-color: #A0AEC0;
        cursor: not-allowed;
    }
`;

// A simple way to inject styles for demonstration purposes.
// In a real app, this would be handled by your CSS solution.
if (!document.getElementById('register-form-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'register-form-styles';
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
}

export default RegisterUser;