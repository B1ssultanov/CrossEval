'use client'

import Link from 'next/link';

import { useState } from 'react';
import axios from 'axios';
// import { useRouter } from 'next/router';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/login', formData);
            if (response.status === 200) {
                const { token, role } = response.data;

                console.log('login data: ', response.data);
                localStorage.setItem('accessToken', token);
                localStorage.setItem('role', role);
                window.location.href = '/'; // Redirect to a dashboard or home page after login
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Invalid email or password');
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form className='flex flex-col' onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className='text-xs text-gray-600 mt-4 self-center'>Don&apos;t have account? <Link href={'/register'} className='font-bold underline text-blue-500'>register</Link></p>
            </form>
        </div>
    );
}
