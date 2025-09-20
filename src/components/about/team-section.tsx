import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { LinkedinIcon, TwitterIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const team = [
  {
    name: "Oplano James Mulbah",
    role: "Founder & CEO",
    bio: "A software engineer who believes learning should be free for everyone—and is building a platform to make it happen.",
    image: "/team/oplano.jpeg",
    socials: [
      {
        name: "Whatsapp",
        link: "https://wa.me/250791676207",
        icon: <FaWhatsapp />,
      },
      {
        name: "Linkedin",
        link: "https://www.linkedin.com/in/oplano-james-mulbah/",
        icon: <LinkedinIcon />,
      },
      {
        name: "Twitter",
        link: "https://twitter.com/JamesOplano",
        icon: <TwitterIcon />,
      },
    ],
  },
  {
    name: "Abdallah Aleer",
    role: "Founder & CTO",
    bio: "A software engineer who loves creating simple, smart learning platforms that make education easier for everyone.",
    image: "/team/abdo.jpeg",
    socials: [
      {
        name: "Whatsapp",
        link: "https://wa.me/250792574452",
        icon: <FaWhatsapp />,
      },
      {
        name: "Linkedin",
        link: "https://www.linkedin.com/in/abdo-junior-7284752b2/",
        icon: <LinkedinIcon />,
      },
      {
        name: "Twitter",
        link: "https://x.com/juniorab444",
        icon: <TwitterIcon />,
      },
    ],
  },
  //   {
  //     name: "SUGIRA NGENDAHAYO Salomon",
  //     role: "Head of Content",
  //     bio: "Passionate about creating fun, engaging content that helps students and learners enjoy every step of the learning journey.",
  //     image: "/team/solo.jpeg",
  //     socials: [
  //       {
  //         name: "Whatsapp",
  //         link: "https://wa.me/250796136584",
  //         icon: <FaWhatsapp />,
  //       },
  //       {
  //         name: "Linkedin",
  //         link: "https://www.linkedin.com/in/salomon-elisha-0601272a1/",
  //         icon: <LinkedinIcon />,
  //       },
  //       {
  //         name: "Twitter",
  //         link: "https://twitter.com/solomonokeke",
  //         icon: <TwitterIcon />,
  //       },
  //     ],
  //   },
];
export default function TeamSection() {
  return (
    <>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              We’re a mix of students, educators, and techies who love making
              learning fun, accessible, and meaningful for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="border-none shadow-md overflow-hidden p-0"
              >
                <div className="aspect-square relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="px-6 pt-2 pb-5">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                  <div className="flex items-center gap-6 mt-4">
                    {member.socials?.map((social, index) => (
                      <Button key={index} variant="outline" size="icon" asChild>
                        <Link href={social.link} target="_blank">
                          {social.icon}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
