'use client'
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  image: string;
}

const CheckoutPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United States (US)');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('California');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [showCoupons, setShowCoupons] = useState(false);
  const [addNote, setAddNote] = useState(false);
  const [showPayPalOptions, setShowPayPalOptions] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      if (typeof window === 'undefined') return;
      const cart = localStorage.getItem('cart');
      if (cart) {
        setOrderItems(JSON.parse(cart));
      }
    };
    loadCart();
  }, []);

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Add shipping or other costs if needed

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const regex = /^[\d\s\-\(\)]+$/;
    return phone.length === 0 || regex.test(phone);
  };

  const validateZipCode = (zip: string) => {
    const regex = /^\d{5}(-\d{4})?$/;
    return regex.test(zip);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'email':
        if (!email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'firstName':
        if (!firstName) {
          newErrors.firstName = 'First name is required';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (!lastName) {
          newErrors.lastName = 'Last name is required';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'address':
        if (!address) {
          newErrors.address = 'Address is required';
        } else {
          delete newErrors.address;
        }
        break;
      case 'city':
        if (!city) {
          newErrors.city = 'City is required';
        } else {
          delete newErrors.city;
        }
        break;
      case 'zipCode':
        if (!zipCode) {
          newErrors.zipCode = 'ZIP code is required';
        } else if (!validateZipCode(zipCode)) {
          newErrors.zipCode = 'Please enter a valid ZIP code';
        } else {
          delete newErrors.zipCode;
        }
        break;
      case 'phone':
        if (phone && !validatePhone(phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
    }

    setErrors(newErrors);
  };

 const handleSubmit = async () => {
  // Validation
  const required = email && firstName && lastName && address && city && zipCode
  if (!required) {
    alert('Please fill required fields')
    return
  }

  // 1️⃣ Insert Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        email,
        first_name: firstName,
        last_name: lastName,
        company,
        address,
        city,
        state,
        country,
        zip_code: zipCode,
        phone,
        subtotal,
        total
      }
    ])
    .select()
    .single()

  if (orderError) {
    console.error(orderError)
    alert('Order failed')
    return
  }

  // 2️⃣ Insert Order Items
  const items = orderItems.map(item => ({
    order_id: order.id,
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    size: item.selectedSize,
    image: item.image
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items)

  if (itemsError) {
    console.error(itemsError)
    alert('Order items failed')
    return
  }

  // 3️⃣ Success
  alert('Order placed successfully!')
  localStorage.removeItem('cart')
  window.location.href = '/home'
}

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <h1 className="text-4xl font-normal text-center mb-12 text-gray-900">
          Checkout
        </h1>

        {orderItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Link href="/shop">
              <button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2">
              {/* Express Checkout */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <h2 className="text-sm text-gray-600 text-center mb-4">
                  Express Checkout
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-[#FFC439] hover:bg-[#f5b835] text-[#003087] font-medium rounded flex items-center justify-center transition py-2">
                    <span className="font-bold text-lg">Pay</span>
                    <span className="font-bold text-lg text-[#009cde]">Pal</span>
                  </button>
                  <button className="bg-[#FFC439] hover:bg-[#f5b835] text-[#003087] font-medium py-2 rounded flex items-center justify-center gap-1 transition">
                    <span className="text-[#009cde] font-bold text-lg">P</span>
                    <span className="text-sm">Pay Later</span>
                  </button>
                </div>
              </div>

              <p className="text-center text-gray-500 text-sm mb-8">
                Or continue below
              </p>

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-lg font-normal text-gray-900 mb-2">
                  Contact information
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  We'll use this email to send you details and updates about your order.
                </p>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) validateField('email');
                  }}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-base ${
                    touched.email && errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-gray-400'
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  You are currently checking out as a guest.
                </p>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h2 className="text-lg font-normal text-gray-900 mb-2">
                  Shipping address
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the address where you want your order delivered.
                </p>

                <div className="space-y-4">
                  {/* Country */}
                  <div className="relative">
                    <label className="block text-xs text-gray-600 mb-1">
                      Country/Region
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 text-base bg-white"
                    >
                      <option>United States (US)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* First and Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (touched.firstName) validateField('firstName');
                        }}
                        onBlur={() => handleBlur('firstName')}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-base ${
                          touched.firstName && errors.firstName 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-gray-400'
                        }`}
                      />
                      {touched.firstName && errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (touched.lastName) validateField('lastName');
                        }}
                        onBlur={() => handleBlur('lastName')}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-base ${
                          touched.lastName && errors.lastName 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-gray-400'
                        }`}
                      />
                      {touched.lastName && errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Company */}
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 text-base"
                  />

                  {/* Address */}
                  <div>
                    <input
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (touched.address) validateField('address');
                      }}
                      onBlur={() => handleBlur('address')}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-base ${
                        touched.address && errors.address 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-gray-400'
                      }`}
                    />
                    {touched.address && errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Add apartment link */}
                  <button className="text-sm text-gray-600 hover:text-gray-900 text-left">
                    + Add apartment, suite, etc.
                  </button>

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (touched.city) validateField('city');
                        }}
                        onBlur={() => handleBlur('city')}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-base ${
                          touched.city && errors.city 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-gray-400'
                        }`}
                      />
                      {touched.city && errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div className="relative">
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400 text-base bg-white"
                      >
                        <option>California</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* ZIP and Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={zipCode}
                        onChange={(e) => {
                          setZipCode(e.target.value);
                          if (touched.zipCode) validateField('zipCode');
                        }}
                        onBlur={() => handleBlur('zipCode')}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-base ${
                          touched.zipCode && errors.zipCode 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-gray-400'
                        }`}
                      />
                      {touched.zipCode && errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (touched.phone) validateField('phone');
                        }}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 text-base ${
                          touched.phone && errors.phone 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-gray-400'
                        }`}
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useSameAddress}
                      onChange={(e) => setUseSameAddress(e.target.checked)}
                      className="w-4 h-4 border-2 border-gray-400 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      Use same address for billing
                    </span>
                  </label>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="mb-8">
                <h2 className="text-lg font-normal text-gray-900 mb-4">
                  Shipping options
                </h2>
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        defaultChecked
                        className="w-5 h-5"
                      />
                      <span className="text-base text-gray-900">Free shipping</span>
                    </div>
                    <span className="text-base font-medium text-gray-900">FREE</span>
                  </label>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mb-8">
                <h2 className="text-lg font-normal text-gray-900 mb-4">
                  Payment options
                </h2>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <label 
                    className="flex items-center justify-between p-4 cursor-pointer bg-white"
                    onClick={() => setShowPayPalOptions(!showPayPalOptions)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        defaultChecked
                        className="w-5 h-5"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-base text-gray-900">PayPal</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-lg text-[#003087]">Pay</span>
                      <span className="font-bold text-lg text-[#009cde]">Pal</span>
                    </div>
                  </label>
                  
                  {/* PayPal Expanded Options */}
                  {showPayPalOptions && (
                    <div className="bg-gray-50 p-4 space-y-3">
                      <button className="w-full bg-[#FFC439] hover:bg-[#f5b835] text-[#003087] font-medium py-2 px-4 rounded transition flex items-center justify-center">
                        <span className="font-bold text-lg text-[#003087]">Pay</span>
                        <span className="font-bold text-lg text-[#009cde]">Pal</span>
                      </button>
                      
                      <button className="w-full bg-[#FFC439] hover:bg-[#f5b835] text-[#003087] font-medium py-2 px-4 rounded transition flex items-center justify-center gap-1">
                        <span className="text-[#009cde] font-bold text-lg">P</span>
                        <span className="text-sm font-medium">Pay Later</span>
                      </button>
                      
                      <button className="w-full bg-[#353A3F] hover:bg-[#2a2e32] text-white font-medium py-2 px-4 rounded transition flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="7" width="18" height="13" rx="2" />
                          <path d="M3 11h18" />
                        </svg>
                        <span className="text-sm">Debit or Credit Card</span>
                      </button>
                      
                      <p className="text-xs text-center text-gray-600 pt-2">
                        Powered by <span className="font-bold text-[#003087]">Pay</span><span className="font-bold text-[#009cde]">Pal</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Note */}
              <div className="mb-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addNote}
                    onChange={(e) => setAddNote(e.target.checked)}
                    className="w-4 h-4 border-2 border-gray-400 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    Add a note to your order
                  </span>
                </label>
                
                {/* Note Textarea */}
                {addNote && (
                  <textarea
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    className="w-full mt-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 text-base resize-none"
                    rows={5}
                  />
                )}
              </div>

              {/* Terms */}
              <p className="text-sm text-gray-600 mb-8">
                By proceeding with your purchase you agree to our{' '}
                <a href="#" className="underline">Terms and Conditions</a> and{' '}
                <a href="#" className="underline">Privacy Policy</a>
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Link href={'/cart'}>
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 cursor-pointer">
                    <span>←</span> Return to Cart
                  </button>
                </Link>
              
                <button 
                  onClick={handleSubmit}
                  className="bg-black text-white px-12 py-4 rounded hover:bg-gray-800 transition font-normal text-base"
                >
                  Place Order
                </button>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg p-6 sticky top-8">
                <h2 className="text-sm text-gray-600 mb-6">Order summary</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {orderItems.map((item) => {
                    const itemKey = `${item.id}-${item.selectedSize || 'no-size'}`;
                    return (
                      <div key={itemKey} className="flex gap-4">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm text-gray-900 mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-900 mb-1">
                            ${item.price.toFixed(2)}
                          </p>
                          {item.selectedSize && (
                            <p className="text-xs text-gray-600">size: {item.selectedSize}</p>
                          )}
                        </div>
                        <div className="text-sm font-normal text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Coupons */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowCoupons(prev => !prev)}
                    className="w-full flex items-center justify-between text-left cursor-pointer">
                    <span className="text-[15px] text-gray-600">Add coupons</span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}>
                      {showCoupons ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 15l-7-7-7 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 9l7 7 7-7"
                        />
                      )}
                    </svg>
                  </button>         
                  {showCoupons && (
                    <div className="mt-4 animate-slideDown">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className="flex-1 px-4 py-3 border border-gray-300 text-[14px] text-gray-700 focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                        />
                        <button className="px-8 bg-black text-white text-[14px] font-medium hover:bg-gray-800 transition-colors">
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-normal">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base">
                    <span className="text-gray-600">Free shipping</span>
                    <span className="text-gray-900 font-medium">FREE</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <span className="text-lg font-normal text-gray-900">Total</span>
                  <span className="text-2xl font-normal text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;