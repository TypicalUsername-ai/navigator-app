import { useLocation, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { DollarSign, ArrowLeft } from "lucide-react";

interface TicketData {
  type: "parking" | "train" | "transport";
  name: string;
  details: Array<{ label: string; value: string }>;
  total: number;
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get ticket data from navigation state
  const ticketData = location.state as TicketData | null;

  const handlePayment = (method: string) => {
    alert(`Processing payment with ${method}...`);
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!ticketData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No ticket information found.</p>
            <Button onClick={handleBack} className="mt-4 w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="w-full shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Left side - Ticket Details */}
              <div className="flex-1 md:pr-6">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-xl font-bold md:text-2xl">
                    {ticketData.name}
                  </CardTitle>
                </CardHeader>

                <div className="space-y-3">
                  {ticketData.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm md:text-base"
                    >
                      <span className="text-gray-600">{detail.label}:</span>
                      <span className="font-semibold">{detail.value}</span>
                    </div>
                  ))}
                </div>

                {/* Total Cost */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="flex items-center gap-2 text-lg font-semibold text-black md:text-xl">
                    <DollarSign className="h-5 w-5" />
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-black md:text-3xl">
                    ${ticketData.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delimiter - Vertical for desktop/tablet, Horizontal for mobile */}
              <div className="my-4 border-t border-gray-200 md:my-0 md:border-l md:border-t-0 md:px-6"></div>

              {/* Right side - Payment Options */}
              <div className="flex-1 md:pl-0">
                <CardHeader className="px-0 pb-4">
                  <CardTitle className="text-xl font-bold md:text-2xl">
                    Payment Method
                  </CardTitle>
                </CardHeader>

                <div className="space-y-3">
                  <Button
                    onClick={() => handlePayment("Apple Pay")}
                    className="h-14 w-full bg-black text-white hover:bg-gray-800"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.08-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <span className="text-base font-semibold">Apple Pay</span>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handlePayment("Google Pay")}
                    className="h-14 w-full border-2 border-gray-300 bg-white text-black hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="text-base font-semibold">Google Pay</span>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handlePayment("BLIK")}
                    className="h-14 w-full border-2 border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base font-semibold">BLIK</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

