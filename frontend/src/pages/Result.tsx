import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Calendar, Printer, Home } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;

  useEffect(() => {
    if (!resultData) {
      navigate('/');
    }
  }, [resultData, navigate]);

  if (!resultData) return null;

  const { success, bookingId, experienceTitle, totalPrice } = resultData;

  return (
    <div className="min-h-screen bg-background">
{/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-cover" />
            <h1 className="text-lg font-bold text-gray-800">highway delite</h1>
          </Link>
        </div>
      </header>      <div className="container mx-auto px-4 max-w-3xl py-12">
        <div className="text-center animate-fade-in">
          {success ? (
            <Card className="p-10 shadow-2xl printable-content">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircle2 className="w-14 h-14 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
                Your booking has been successfully processed. We've sent a confirmation email with all the details.
              </p>

              <Card className="p-8 mb-10 text-left bg-gray-50 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                  Booking Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 px-5 bg-white rounded-xl border border-gray-200">
                    <span className="font-medium text-gray-600">Booking ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-900">{bookingId}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 px-5 bg-white rounded-xl border border-gray-200">
                    <span className="font-medium text-gray-600">Experience:</span>
                    <span className="font-semibold text-gray-900 text-right max-w-xs">{experienceTitle}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 px-5 bg-green-50 rounded-xl border border-green-200">
                    <span className="font-medium text-gray-600">Total Paid:</span>
                    <span className="text-3xl font-bold text-green-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Card>

              <div className="bg-yellow-50 rounded-xl p-6 mb-10 border border-yellow-200">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Important Information</h3>
                    <p className="text-gray-700">
                      Please arrive 15 minutes before your scheduled time. Bring a valid ID and any required equipment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="gap-2 shadow-lg">
                    <Home className="w-5 h-5" />
                    Book Another Experience
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    const printContent = document.querySelector('.printable-content');
                    if (printContent) {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Booking Confirmation - ${bookingId}</title>
                              <style>
                                body { font-family: Arial, sans-serif; margin: 20px; }
                                .confirmation { text-align: center; margin-bottom: 30px; }
                                .details { margin: 20px 0; }
                                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                                .total { font-weight: bold; font-size: 18px; color: #16a34a; }
                              </style>
                            </head>
                            <body>
                              <div class="confirmation">
                                <h1>Booking Confirmed!</h1>
                                <p>Your booking has been successfully processed.</p>
                              </div>
                              <div class="details">
                                <div class="detail-row">
                                  <span>Booking ID:</span>
                                  <span>${bookingId}</span>
                                </div>
                                <div class="detail-row">
                                  <span>Experience:</span>
                                  <span>${experienceTitle}</span>
                                </div>
                                <div class="detail-row total">
                                  <span>Total Paid:</span>
                                  <span>₹${totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }
                  }}
                  variant="outline"
                  size="lg"
                  className="gap-2 shadow-lg"
                >
                  <Printer className="w-5 h-5" />
                  Print Confirmation
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-10 shadow-2xl">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <XCircle className="w-14 h-14 text-destructive" />
              </div>

              <h1 className="text-5xl font-bold text-foreground mb-4">Booking Failed</h1>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                Unfortunately, we couldn't process your booking. Please try again or contact our support team.
              </p>

              <Link to="/">
                <Button size="lg" className="gap-2 shadow-lg">
                  <Home className="w-5 h-5" />
                  Try Again
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
