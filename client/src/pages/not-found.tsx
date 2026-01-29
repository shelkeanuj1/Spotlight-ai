import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center border-2">
        <CardContent className="pt-10 pb-10 space-y-6">
          <div className="flex justify-center">
            <AlertCircle className="h-20 w-20 text-orange-500 opacity-80" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">404</h1>
            <p className="text-lg text-gray-600 font-medium">Page Not Found</p>
          </div>

          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            The parking spot you are looking for has been occupied or does not exist.
          </p>

          <Link href="/">
            <Button className="w-full mt-4" size="lg">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
