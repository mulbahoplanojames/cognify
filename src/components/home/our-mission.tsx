import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ourMissions } from "@/data/home-page";

export default function OurMissionSection() {
  return (
    <section className="py-24 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Open Source Mission</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe knowledge should be free and accessible to every student
            and everyone who seeks to learn. Our platform is created by the
            community, for the community—built to inspire, share, and grow
            together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ourMissions.map((mission) => (
            <Card
              key={mission.title}
              className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-card/50"
            >
              <CardHeader>
                <div
                  className={`mx-auto w-16 h-16 ${mission.bgColor} rounded-full flex items-center justify-center ${mission.color} mb-4`}
                >
                  <mission.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl mb-3">{mission.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {mission.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
