import { Metadata } from "next";
import { getIdThroughSubdomain, getThemeNameApi } from "@/app/actions/portfolio";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const subdomain = params.site;

    // Get portfolio ID through subdomain
    const response = await getIdThroughSubdomain({ subdomain });
    if (!response.success || !response.portfolioId) {
      return {
        title: "Portfolio Not Found",
        description: "The requested portfolio could not be found.",
      };
    }

    // Fetch theme data which contains SEO settings
    const themeResult = await getThemeNameApi({ portfolioId: response.portfolioId });

    if (themeResult.success && themeResult.data?.content) {
      const content = themeResult.data.content as any;
      const seoSection = content.sections?.find(
        (section: any) => section.type === "seo"
      );

      if (seoSection?.data) {
        // Determine favicon type
        let faviconType = "image/x-icon";
        if (seoSection.data.favicon) {
          if (seoSection.data.favicon.endsWith(".png"))
            faviconType = "image/png";
          else if (seoSection.data.favicon.endsWith(".svg"))
            faviconType = "image/svg+xml";
          else if (seoSection.data.favicon.endsWith(".ico"))
            faviconType = "image/x-icon";
        }

        return {
          title: seoSection.data.title || "Portfolio",
          description:
            seoSection.data.description || "Generated by create next app",
          icons: {
            icon: [
              { url: seoSection.data.favicon || "/favicon.ico", type: faviconType }
            ]
          }
        };
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // Fallback metadata
  return {
    title: "Portfolio",
    description: "Generated by create next app",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased" suppressHydrationWarning>
      {children}
    </div>
  );
} 