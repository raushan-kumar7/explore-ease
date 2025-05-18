import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { images } from "@/assets";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100">
      <div className="container mx-auto px-6 py-24">
        <div className="transform transition-all duration-500 ease-in-out">
          <Card className="relative max-w-4xl mx-auto border-none bg-white/90 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-orange-100 p-4 rounded-full mb-6 transition-transform duration-300 hover:scale-110">
                  <Mail className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Subscribe for Travel Updates
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl">
                  Get exclusive travel tips, destination guides, and special
                  offers delivered straight to your inbox.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="max-w-xl mx-auto space-y-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className={`flex-1 h-12 px-4 transition-all duration-200 ${
                      status === "error"
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-orange-500"
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setError("");
                      }
                    }}
                    required
                  />
                  <Button
                    type="submit"
                    className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-medium 
                             transition-colors duration-300 disabled:opacity-50 cursor-pointer"
                    disabled={status === "loading" || status === "success"}
                  >
                    {status === "loading" && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {status === "success" ? (
                      <span className="flex items-center">
                        <Check className="w-4 h-4 mr-2" />
                        Subscribed!
                      </span>
                    ) : status === "loading" ? (
                      "Subscribing..."
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    status === "success" || status === "error"
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4 h-0"
                  }`}
                >
                  {(status === "success" || status === "error") && (
                    <Alert
                      className={`
                        ${
                          status === "success"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : ""
                        }
                        ${
                          status === "error"
                            ? "bg-red-50 text-red-800 border-red-200"
                            : ""
                        }
                      `}
                    >
                      <AlertDescription>
                        {status === "success"
                          ? "Thank you for subscribing! We'll keep you updated with the latest travel information."
                          : error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </form>

              <p className="text-sm text-gray-500 text-center mt-6">
                By subscribing, you agree to receive our newsletter and travel
                updates. You can unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          className="absolute right-0 bottom-0 hidden lg:block w-1/3 max-w-md 
                     transition-all duration-500 ease-in-out transform translate-x-0"
        >
          <img src={images.tourist} alt="tourist" className="object-contain" />
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
