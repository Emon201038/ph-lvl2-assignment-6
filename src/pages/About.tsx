import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Globe } from "lucide-react";
import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About | ParcelPro";
  }, []);
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-primary">ParcelPro</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're revolutionizing the parcel delivery industry with cutting-edge
            technology, reliable service, and a commitment to connecting people
            across distances.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                To provide fast, reliable, and secure parcel delivery services
                that connect businesses and individuals, making distance
                irrelevant in today's connected world. We strive to exceed
                expectations through innovation and exceptional customer
                service.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                To become the leading parcel delivery platform that empowers
                communities through seamless logistics solutions, advanced
                tracking technology, and sustainable delivery practices that
                benefit everyone.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Parcels Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.5%</div>
              <div className="text-muted-foreground">Delivery Success</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Sarah Johnson</CardTitle>
                <Badge variant="secondary">CEO & Founder</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  With 15+ years in logistics, Sarah leads our vision of
                  transforming parcel delivery through technology and
                  customer-first approach.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Michael Chen</CardTitle>
                <Badge variant="secondary">CTO</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Michael oversees our technology infrastructure, ensuring our
                  platform remains cutting-edge, secure, and scalable for future
                  growth.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Emily Rodriguez</CardTitle>
                <Badge variant="secondary">Head of Operations</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Emily manages our nationwide operations, ensuring every parcel
                  reaches its destination safely and on time, every single day.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Excellence
              </h3>
              <p className="text-muted-foreground">
                We strive for excellence in every delivery, ensuring the highest
                standards of service quality.
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Trust
              </h3>
              <p className="text-muted-foreground">
                Building lasting relationships through transparency,
                reliability, and consistent communication.
              </p>
            </div>
            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Innovation
              </h3>
              <p className="text-muted-foreground">
                Continuously improving our services through technology and
                creative problem-solving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
