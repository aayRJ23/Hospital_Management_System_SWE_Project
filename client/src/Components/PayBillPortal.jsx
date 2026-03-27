import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { FaSpinner, FaCreditCard, FaQrcode, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const PayBillPortal = ({ appointment, closePopup }) => {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('method');
  const [otpCountdown, setOtpCountdown] = useState(120);
  const [otp, setOtp] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let countdown;
    if (step === 'otp' && otpCountdown > 0) {
      countdown = setInterval(() => setOtpCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [step, otpCountdown]);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 2000);
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        // Step 1: Fetch the bill document for this appointment
        const billRes = await axios.get(
          `http://localhost:8000/api/v1/bill/${appointment._id}`,
          { withCredentials: true }
        );
        const billId = billRes.data._id;

        // Step 2: Mark the bill as paid — triggers BILL_PAID notifications to Admin + Doctor
        await axios.put(
          `http://localhost:8000/api/v1/bill/pay/${billId}`,
          {},
          { withCredentials: true }
        );

        setPaymentStatus('Paid');
        setStep('success');
      } catch (err) {
        console.error('Payment failed:', err);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const renderLoader = () => (
    <div className="flex justify-center items-center h-full">
      <FaSpinner className="animate-spin text-white text-4xl" />
      <p className="ml-4 text-lg text-white">Proceeding to Payment...</p>
    </div>
  );

  const renderMethodSelection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 p-4 bg-black rounded-lg shadow-lg text-white"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Select Payment Method</h2>
      <button
        onClick={() => setStep('card')}
        className="bg-gray-800 text-white py-2 px-4 rounded-full w-full hover:bg-gray-700 transition duration-300 flex items-center justify-center"
      >
        <FaCreditCard className="mr-2" /> Pay with Card
      </button>
      <button
        onClick={() => setStep('qr')}
        className="bg-gray-800 text-white py-2 px-4 rounded-full w-full hover:bg-gray-700 transition duration-300 flex items-center justify-center"
      >
        <FaQrcode className="mr-2" /> Pay via QR Code
      </button>
    </motion.div>
  );

  const renderCardForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-black rounded-lg shadow-lg text-white"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Card Payment</h2>
      <form>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Card Number
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
            placeholder="1234 5678 9123 4567"
          />
        </div>
        <div className="mb-4 flex justify-between">
          <div className="w-1/2 mr-2">
            <label className="block text-white text-sm font-bold mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
              placeholder="MM/YY"
            />
          </div>
          <div className="w-1/2 ml-2">
            <label className="block text-white text-sm font-bold mb-2">
              CVV
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
              placeholder="123"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Name on Card
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
            placeholder="John Doe"
          />
        </div>
        <button
          type="button"
          onClick={handlePayment}
          className="bg-gray-800 text-white py-2 px-4 rounded-full w-full hover:bg-gray-700 transition duration-300"
        >
          Pay Now
        </button>
        <button
          type="button"
          onClick={() => setStep('method')}
          className="mt-2 bg-gray-600 text-white py-2 px-4 rounded-full w-full hover:bg-gray-500 transition duration-300"
        >
          Back
        </button>
      </form>
    </motion.div>
  );

  const renderQrCode = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-black rounded-lg shadow-lg text-white"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Scan QR Code</h2>
      <div className="flex justify-center">
        <QRCode value={`Pay for appointment ID: ${appointment._id}`} size={200} />
      </div>
      <div className="mt-4 text-center">
        <p>Phone Number: 123-456-7890</p>
        <p>UPI ID: example@upi</p>
      </div>
      <button
        type="button"
        onClick={handlePayment}
        className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-full w-full hover:bg-gray-700 transition duration-300"
      >
        Pay Now
      </button>
      <button
        type="button"
        onClick={() => setStep('method')}
        className="mt-2 bg-gray-600 text-white py-2 px-4 rounded-full w-full hover:bg-gray-500 transition duration-300"
      >
        Back
      </button>
    </motion.div>
  );

  const renderOtpForm = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-black rounded-lg shadow-lg text-white"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          OTP
        </label>
        <input
          type="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="******"
        />
      </div>
      <div className="mb-4 text-center">
        Time remaining: {Math.floor(otpCountdown / 60)}:{otpCountdown % 60 < 10 ? `0${otpCountdown % 60}` : otpCountdown % 60}
      </div>
      <button
        type="button"
        onClick={handleOtpSubmit}
        className="bg-gray-800 text-white py-2 px-4 rounded-full w-full hover:bg-gray-700 transition duration-300"
      >
        Submit OTP
      </button>
      <button
        type="button"
        onClick={() => setStep('method')}
        className="mt-2 bg-gray-600 text-white py-2 px-4 rounded-full w-full hover:bg-gray-500 transition duration-300"
      >
        Back
      </button>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 p-4 bg-black rounded-lg shadow-lg text-white"
    >
      <div className="flex items-center justify-center mb-4">
        <FaCheckCircle className="text-green-500 text-4xl" />
      </div>
      <h2 className="text-2xl font-bold text-center">Transaction Successful!</h2>
      <p className="text-center">Your payment has been processed successfully.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-2 bg-gray-600 text-white py-2 px-4 rounded-full w-full hover:bg-gray-500 transition duration-300"
      >
        Close
      </button>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
      <div className="relative bg-black rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition duration-300"
        >
          &times;
        </button>
        {loading ? renderLoader() : (
          <div className="p-4">
            {step === 'method' && renderMethodSelection()}
            {step === 'card' && renderCardForm()}
            {step === 'qr' && renderQrCode()}
            {step === 'otp' && renderOtpForm()}
            {step === 'success' && renderSuccess()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayBillPortal;