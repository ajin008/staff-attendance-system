import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "../context/AuthContext";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Attendance System",
  description: "Staff Attendance Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            closeButton
            richColors={false}
            toastOptions={{
              style: {
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                padding: "0.625rem 1rem",
                fontFamily: "Satoshi, sans-serif",
                fontSize: "0.875rem",
                color: "#0f172a",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
