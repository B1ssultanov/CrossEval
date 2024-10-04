'use client'

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        // name: '',
        // surname: '',
        // login: '',
        // gender: '',
        // faculty: '',
        // speciality: '',
        // birthday: '',
        // isSupervisor: '',
        email: '',
        password: '',
        password_confirmation: '',
        // university_id: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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
        setSuccess(false);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register', formData);
            console.log(response);
            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.data.errors) {
                    const errors = Object.values(err.response.data.errors).flat();
                    setError(errors.join(', '));
                } else {
                    setError(err.response.data.message || 'Something went wrong');
                }
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 border mt-10 border-gray-300 rounded-lg my-5">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form className='flex flex-col' onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key} className="mb-4">
                        <label className="block text-gray-700 mb-2 capitalize" htmlFor={key}>
                            {key.replace('_', ' ')}
                        </label>
                        <input
                            type={key.includes('password') ? 'password' : 'text'}
                            name={key}
                            id={key}
                            value={formData[key]}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                ))}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">Registration successful!</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className='text-xs text-gray-600 mt-4 self-center'>You allready registered? <Link href={'/login'} className='underline font-bold text-blue-500'>log in</Link></p>
                
            </form>
        </div>
    );
}
