import { Heart, Code, Users, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OpenSourceMission() {
  return (
    <Card className="premium-shadow border-0 mt-5">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Heart className="h-6 w-6 text-red-500" />
          Our Open Source Mission
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground leading-relaxed text-lg">
          We believe learning should be free for everyone—no matter where you’re
          from, what you study, or what resources you have. Cognify brings
          together students, professionals, and curious minds in one big
          community to share ideas, learn faster, and build without limits
        </p>
        <p className="text-muted-foreground leading-relaxed text-lg">
          With the mix of smart AI tools and real people, we make learning
          personal and fun—matching your goals, level, and passions. Whether
          you’re just starting out, chasing career growth, or building something
          new, we’ve got the content and community to help you shine—always
          free, always open.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Code className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Open Source</h3>
            <p className="text-sm text-muted-foreground">
              Made together, shared together—built by students and learners, for
              everyone who loves to grow and give back.
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Inclusive</h3>
            <p className="text-sm text-muted-foreground">
              Open to everyone—students, pros, and big dreamers—because learning
              grows stronger when we learn together
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Lightbulb className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Innovation</h3>
            <p className="text-sm text-muted-foreground">
              Shaping the future of free learning—fresh ideas, smart tools, and
              new ways for students and learners to grow.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
