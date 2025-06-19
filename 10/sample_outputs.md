# Sample Application Runs

This document contains sample runs of the AI Product Search Tool demonstrating different types of natural language queries and their results.

## Sample Run 1: Electronics Under $100 In Stock

### User Input:
```
🔍 Search: I need electronics under $100 that are in stock
```

### System Response:
```
⏳ Searching products...

Search Criteria Detected:
{
  "categories": ["Electronics"],
  "maxPrice": 100,
  "inStockOnly": true
}

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
3. Gaming Mouse - $59.99, Rating: 4.3, In Stock
4. External Hard Drive - $89.99, Rating: 4.4, In Stock
5. Portable Charger - $29.99, Rating: 4.2, In Stock
```

### Analysis:
The AI correctly identified:
- Category: Electronics
- Price constraint: Under $100 (maxPrice: 100)
- Stock requirement: In stock only (inStockOnly: true)

The system returned 5 products that match all criteria.

---

## Sample Run 2: High-Rated Fitness Equipment

### User Input:
```
🔍 Search: Show me fitness equipment with good ratings above 4.5
```

### System Response:
```
⏳ Searching products...

Search Criteria Detected:
{
  "categories": ["Fitness"],
  "minRating": 4.5
}

Filtered Products:
1. Treadmill - $899.99, Rating: 4.6, Out of Stock
2. Dumbbell Set - $149.99, Rating: 4.7, In Stock
3. Exercise Bike - $499.99, Rating: 4.5, In Stock
4. Foam Roller - $24.99, Rating: 4.5, In Stock
```

### Analysis:
The AI correctly identified:
- Category: Fitness
- Rating requirement: Above 4.5 (minRating: 4.5)

The system returned 4 fitness products with ratings of 4.5 or higher, including both in-stock and out-of-stock items.

---
