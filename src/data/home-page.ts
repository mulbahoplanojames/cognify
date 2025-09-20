import { icons, LucideIcon } from "lucide-react";

interface Mission {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const ourMissions: Mission[] = [
  {
    title: "For Students",
    description:
      "Access world-class educational content, tutorials, and resources completely free. Build your skills without financial barriers.",
    icon: icons.Users,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    title: "For Professionals",
    description:
      "Stay ahead with cutting-edge insights, industry trends, and expert knowledge shared by thought leaders worldwide.",
    icon: icons.TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "For Visionaries",
    description:
      "Share your innovations, connect with like-minded individuals, and contribute to the global knowledge ecosystem.",
    icon: icons.Globe,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
];

export const premiumLibrary = [
  {
    id: 1,
    title: "Advanced AI Integration Strategies for Enterprise Success",
    description:
      " Discover how Fortune 500 companies are leveraging AI to transform their operations, increase efficiency by 300%, and drive unprecedented growth in competitive markets.",
    author: "Dr. Sarah Chen",
    readTime: "12 min",
    rating: "4.9",
    tags: ["Featured", "Premium"],
    imageUrl: "/images/premium-article-1.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Blockchain Revolution in Finance",
    description:
      "Explore the transformative impact of blockchain technology on the financial sector, including real-world use cases and future trends.",
    author: "Michael Rodriguez",
    readTime: "10 min",
    rating: "4.8",
    tags: ["Premium"],
    imageUrl: "/images/premium-article-2.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Quantum Computing Breakthroughs",
    description:
      "Delve into the latest advancements in quantum computing and their potential to revolutionize industries from cryptography to drug discovery.",
    author: "Dr. Lisa Wang",
    readTime: "15 min",
    rating: "4.9",
    tags: ["Premium"],
    imageUrl: "/images/premium-article-3.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Sustainable Tech Innovation",
    description:
      "Explore the latest trends in sustainable technology and their potential to create a greener future.",
    author: "James Thompson",
    readTime: "12 min",
    rating: "4.7",
    tags: ["Premium"],
    imageUrl: "/images/premium-article-4.jpg",
    featured: false,
  },
];
