import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  createdAt: string;
}

export interface Party {
  id: string;
  name: string;
  type: 'supplier' | 'distributor';
  contact: string;
  address: string;
  balance: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  createdAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  createdAt: string;
}

export interface Purchase {
  id: string;
  partyId: string;
  partyName: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  createdAt: string;
}

export interface FishBox {
  id: string;
  boxNumber: string;
  fishType: string;
  weight: number;
  grade: 'A' | 'B' | 'C';
  supplierId?: string;
  customerId?: string;
  status: 'received' | 'sent' | 'in_stock';
  date: string;
}

interface DataContextType {
  customers: Customer[];
  parties: Party[];
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  fishBoxes: FishBox[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addParty: (party: Omit<Party, 'id' | 'createdAt'>) => void;
  updateParty: (id: string, party: Partial<Party>) => void;
  deleteParty: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'createdAt'>) => void;
  addFishBox: (fishBox: Omit<FishBox, 'id'>) => void;
  updateFishBox: (id: string, fishBox: Partial<FishBox>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ocean Fresh Restaurant',
    email: 'orders@oceanfresh.com',
    phone: '+1-555-0101',
    address: '123 Harbor Street, Coastal City',
    balance: 2450.00,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Maritime Seafood Market',
    email: 'purchasing@maritime.com',
    phone: '+1-555-0102',
    address: '456 Fisherman\'s Wharf, Port Town',
    balance: 1850.75,
    createdAt: '2024-01-20T14:15:00Z'
  }
];

const initialParties: Party[] = [
  {
    id: '1',
    name: 'Deep Sea Fisheries Ltd.',
    type: 'supplier',
    contact: '+1-555-0201',
    address: '789 Trawler Avenue, Fish Port',
    balance: -3200.00,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: '2',
    name: 'Coastal Distribution Co.',
    type: 'distributor',
    contact: '+1-555-0202',
    address: '321 Distribution Drive, Trade Center',
    balance: 1500.25,
    createdAt: '2024-01-12T11:45:00Z'
  }
];

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Atlantic Salmon',
    category: 'Fresh Fish',
    unit: 'kg',
    purchasePrice: 12.50,
    sellingPrice: 18.00,
    stock: 150,
    minStock: 20,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Pacific Tuna',
    category: 'Fresh Fish',
    unit: 'kg',
    purchasePrice: 15.00,
    sellingPrice: 22.00,
    stock: 80,
    minStock: 15,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'King Prawns',
    category: 'Shellfish',
    unit: 'kg',
    purchasePrice: 25.00,
    sellingPrice: 35.00,
    stock: 45,
    minStock: 10,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [fishBoxes, setFishBoxes] = useState<FishBox[]>([]);

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedCustomers = localStorage.getItem('fishmarket_customers');
    const savedParties = localStorage.getItem('fishmarket_parties');
    const savedProducts = localStorage.getItem('fishmarket_products');
    const savedSales = localStorage.getItem('fishmarket_sales');
    const savedPurchases = localStorage.getItem('fishmarket_purchases');
    const savedFishBoxes = localStorage.getItem('fishmarket_fishboxes');

    setCustomers(savedCustomers ? JSON.parse(savedCustomers) : initialCustomers);
    setParties(savedParties ? JSON.parse(savedParties) : initialParties);
    setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
    setSales(savedSales ? JSON.parse(savedSales) : []);
    setPurchases(savedPurchases ? JSON.parse(savedPurchases) : []);
    setFishBoxes(savedFishBoxes ? JSON.parse(savedFishBoxes) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem('fishmarket_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('fishmarket_parties', JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem('fishmarket_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fishmarket_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('fishmarket_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('fishmarket_fishboxes', JSON.stringify(fishBoxes));
  }, [fishBoxes]);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer = {
      ...customer,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...customerData } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  const addParty = (party: Omit<Party, 'id' | 'createdAt'>) => {
    const newParty = {
      ...party,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setParties(prev => [...prev, newParty]);
  };

  const updateParty = (id: string, partyData: Partial<Party>) => {
    setParties(prev => prev.map(party => 
      party.id === id ? { ...party, ...partyData } : party
    ));
  };

  const deleteParty = (id: string) => {
    setParties(prev => prev.filter(party => party.id !== id));
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale = {
      ...sale,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setSales(prev => [...prev, newSale]);
  };

  const addPurchase = (purchase: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newPurchase = {
      ...purchase,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setPurchases(prev => [...prev, newPurchase]);
  };

  const addFishBox = (fishBox: Omit<FishBox, 'id'>) => {
    const newFishBox = {
      ...fishBox,
      id: generateId()
    };
    setFishBoxes(prev => [...prev, newFishBox]);
  };

  const updateFishBox = (id: string, fishBoxData: Partial<FishBox>) => {
    setFishBoxes(prev => prev.map(fishBox => 
      fishBox.id === id ? { ...fishBox, ...fishBoxData } : fishBox
    ));
  };

  return (
    <DataContext.Provider value={{
      customers,
      parties,
      products,
      sales,
      purchases,
      fishBoxes,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addParty,
      updateParty,
      deleteParty,
      addProduct,
      updateProduct,
      deleteProduct,
      addSale,
      addPurchase,
      addFishBox,
      updateFishBox
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}