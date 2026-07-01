import { HomeClient } from "@/components/home-client";
import { programs } from "@/lib/programs";

export default function HomePage() {
  return <HomeClient programs={programs} />;
}
