import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api'; // Your configured axios instance
import Spinner from '../components/common/Spinner'; // Your spinner component

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // States: 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('No verification token provided. Please check your link.');
            return;
        }

        const verifyUserToken = async () => {
            try {
                const res = await api.get(`/auth/verify-email?token=${token}`);
                setStatus('success');
                setMessage(res.data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        verifyUserToken();
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center text-center h-screen -mt-16">
            {status === 'verifying' && <Spinner />}
            {status !== 'verifying' && (
                <>
                    <h1 className={`text-4xl font-bold mb-4 ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {status === 'success' ? 'Verification Successful!' : 'Verification Failed'}
                    </h1>
                    <p className="text-lg text-text-light">{message}</p>
                    {status === 'success' && (
                        <Link to="/login" className="mt-8 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                            Proceed to Login
                        </Link>
                    )}
                </>
            )}
        </div>
    );
};

export default VerifyEmail;
