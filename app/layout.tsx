import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google Ads Gemini Demo",
  description: "AI-powered Google Ads data analysis with function calling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
