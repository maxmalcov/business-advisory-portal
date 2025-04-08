import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SaleInvoices from "./pages/SaleInvoices";
import CreateSaleInvoice from "./pages/SaleInvoices/Create";

createRoot(document.getElementById("root")!).render(<App />);
