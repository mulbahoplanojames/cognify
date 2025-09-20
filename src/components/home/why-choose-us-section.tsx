import { whyChooseUsFeatures } from "@/data/home-page";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Cognify?</h2>
          <p className="text-xl text-muted-foreground">
            Premium features that set us apart
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUsFeatures.map((feature) => (
            <Card
              key={feature.id}
              className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-card/50"
            >
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <feature.icon className="size-8" />
                </div>
                <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
