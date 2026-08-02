import "./globals.css";
import AuthProvider from "../../helper/authProvider";

export const metadata = {
  title: "Accuride TODO Calendar",
  description: "Isolated TODO items calendar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}