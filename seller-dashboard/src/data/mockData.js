export const user = { name: 'Seller User' };

export const orders = [
  { id: 'ORD123', product: 'Red Saree', date: '2024-07-10', status: 'Pending' },
  { id: 'ORD124', product: 'Blue Kurti', date: '2024-07-09', status: 'Delivered' },
  { id: 'ORD125', product: 'Green Dupatta', date: '2024-07-08', status: 'Pending' },
];

export const returns = [
  { product: 'Red Saree', reason: 'Damaged', date: '2024-07-11', status: 'Processed' },
  { product: 'Blue Kurti', reason: 'Wrong Size', date: '2024-07-10', status: 'Pending' },
];

export const products = [
  { name: 'Red Saree', catalogId: 'CAT001', category: 'Saree', image: '/assets/saree.jpg', stock: 0 },
  { name: 'Blue Kurti', catalogId: 'CAT002', category: 'Kurti', image: '/assets/kurti.jpg', stock: 2 },
  { name: 'Green Dupatta', catalogId: 'CAT003', category: 'Dupatta', image: '/assets/dupatta.jpg', stock: 10 },
];

export const ads = [
  { id: 1, title: 'Mega Sale', image: '/assets/ad1.jpg' },
  { id: 2, title: 'Festival Offer', image: '/assets/ad2.jpg' },
]; 