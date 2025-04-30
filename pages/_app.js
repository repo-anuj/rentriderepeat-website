import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { BikeProvider } from '../context/BikeContext';
import { BookingProvider } from '../context/BookingContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <BikeProvider>
        <BookingProvider>
          <Component {...pageProps} />
          <Toaster position="top-center" />
        </BookingProvider>
      </BikeProvider>
    </AuthProvider>
  );
}

export default MyApp;
