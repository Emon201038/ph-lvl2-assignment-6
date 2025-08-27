import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  document.title = "404 | ParcelPro";
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Package className="h-24 w-24 text-muted-foreground/30" />
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                !
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">404</h1>
            <h2 className="text-xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              Oops! The page you're looking for seems to have been misplaced.
              Don't worry, even our best delivery drivers sometimes take a wrong
              turn.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild>
                <Link to="/track">
                  <Search className="mr-2 h-4 w-4" />
                  Track Parcel
                </Link>
              </Button>

              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <Link to="/about" className="text-primary hover:underline">
                About Us
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-primary hover:underline">
                Contact
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
