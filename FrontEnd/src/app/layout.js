import '../app/globals.css';
// import 'antd/dist/reset.css';
import ClientLayout from '../components/ClientLayout'; 
export const metadata = {
  title: 'CrossEval',
  description: 'Learn by checking',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout> {/* Use the Client Component here */}
      </body>
    </html>
  );
}
