import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "이름풀이",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0612",
    theme_color: "#6d28d9",
    lang: "ko",
    categories: ["lifestyle", "entertainment"],
  };
}
