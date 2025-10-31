import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";
import type { PromoValidation } from "../types";
import { bookingsApi, promoApi } from "../utils/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    promoCode: "",
  });

  const [promoValidation, setPromoValidation] = useState<PromoValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingData) navigate("/");
  }, [bookingData, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "promoCode") setPromoValidation(null);
  };

  const handlePromoValidation = async () => {
    if (!formData.promoCode.trim()) return;
    setPromoLoading(true);
    try {
      const response = await promoApi.validate(formData.promoCode, bookingData.price * bookingData.participants);
      setPromoValidation(response.data);
    } catch {
      setPromoValidation({
        valid: false,
        discountType: "",
        discountValue: 0,
        discountAmount: 0,
        finalAmount: bookingData.price * bookingData.participants,
      });
    } finally {
      setPromoLoading(false);
    }
  };

  const calculateTotal = () => {
    const basePrice = (bookingData.price * bookingData.participants) || 0;
    const discount = promoValidation?.valid ? promoValidation.discountAmount : 0;
    return Math.max(0, basePrice - discount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.userEmail || !formData.userPhone) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingPayload = {
        experienceId: bookingData.experienceId,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        date: bookingData.selectedDate,
        time: bookingData.selectedTime,
        participants: bookingData.participants,
        promoCode: formData.promoCode || undefined,
        discount: promoValidation?.valid ? promoValidation.discountAmount : 0,
        totalPrice: calculateTotal(),
      };

      await bookingsApi.create(bookingPayload);

      // Generate random booking ID
      const generateBookingId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      navigate("/result", {
        state: {
          success: true,
          bookingId: generateBookingId(),
          experienceTitle: bookingData.experienceTitle,
          totalPrice: calculateTotal(),
        },
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
     {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-cover" />
            <h1 className="text-lg font-bold text-gray-800">highway delite</h1>
          </Link>
        </div>
      </header>
      <br></br>
      <div className="container mx-auto px-4 max-w-5xl pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Review your details and confirm your experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-md">
              <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium text-lg">{bookingData.experienceTitle}</p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-500" />
                      <span>Date:</span>
                    </div>
                    <span>{new Date(bookingData.selectedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span>Time:</span>
                    </div>
                    <span>{bookingData.selectedTime}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-yellow-500" />
                      <span>Participants:</span>
                    </div>
                    <span>{bookingData.participants} Person(s)</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Price:</span>
                    <span>₹{(bookingData.price * bookingData.participants).toLocaleString("en-IN")}</span>
                  </div>

                  {promoValidation?.valid && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{promoValidation.discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between font-bold text-xl">
                    <span>Final Amount:</span>
                    <span className="text-yellow-600">
                      ₹{calculateTotal().toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="p-8 shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Your Information</h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="userName">Full Name *</Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="userEmail">Email *</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="userPhone">Phone *</Label>
                      <Input
                        id="userPhone"
                        type="tel"
                        name="userPhone"
                        value={formData.userPhone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="bg-gray-100 p-5 rounded-xl mt-6">
                    <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                    <div className="flex gap-3 mt-3">
                      <Input
                        id="promoCode"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        placeholder="Enter promo code"
                      />
                      <Button
                        type="button"
                        onClick={handlePromoValidation}
                        disabled={promoLoading || !formData.promoCode.trim()}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        {promoLoading ? "Checking..." : "Apply"}
                      </Button>
                    </div>
                    {promoValidation && (
                      <p
                        className={`text-sm mt-3 ${
                          promoValidation.valid ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {promoValidation.valid
                          ? `✓ Discount applied: ₹${promoValidation.discountAmount.toLocaleString("en-IN")}`
                          : "✗ Invalid promo code"}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 text-white text-lg py-6 font-semibold rounded-xl shadow-md"
                >
                  {loading ? "Processing..." : "Complete Booking"}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By completing this booking, you agree to our terms and conditions.
                </p>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
