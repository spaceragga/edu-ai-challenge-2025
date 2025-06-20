# Sample Application Runs

This document contains sample runs of the AI Product Search Tool demonstrating different types of natural language queries and their results.

## Sample Run 1: Most expensive kitchen product

### User Input:
```
🔍 Search: I want one most expensive kitchen product
```

### System Response:
```
⏳ Searching products...

Search Criteria Detected:
{
  "categories": [
    "Kitchen"
  ],
  "sortBy": "price",
  "order": "desc",
  "limit": 1
}

Filtered Products:
1. Refrigerator - $999.99, Rating: 4.8, Out of Stock

==================================================
```


## Sample Run 2: High-rated, aren't clothing

### User Input:
```
🔍 Search: High-rated items that aren't clothing
```

### System Response:
```
⏳ Searching products...

Search Criteria Detected:
{
  "minRating": 4,
  "excludeCategories": [
    "Clothing"
  ]
}

Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Gaming Laptop - $1299.99, Rating: 4.8, Out of Stock
3. Smart Watch - $199.99, Rating: 4.6, In Stock
4. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
5. 4K Monitor - $349.99, Rating: 4.7, In Stock
6. Smartphone - $799.99, Rating: 4.5, Out of Stock
7. Noise-Cancelling Headphones - $299.99, Rating: 4.8, In Stock
8. Gaming Mouse - $59.99, Rating: 4.3, In Stock
9. External Hard Drive - $89.99, Rating: 4.4, In Stock
10. Portable Charger - $29.99, Rating: 4.2, In Stock
11. Yoga Mat - $19.99, Rating: 4.3, In Stock
12. Treadmill - $899.99, Rating: 4.6, Out of Stock
13. Dumbbell Set - $149.99, Rating: 4.7, In Stock
14. Exercise Bike - $499.99, Rating: 4.5, In Stock
15. Resistance Bands - $14.99, Rating: 4.1, In Stock
16. Kettlebell - $39.99, Rating: 4.3, In Stock
17. Foam Roller - $24.99, Rating: 4.5, In Stock
18. Pull-up Bar - $59.99, Rating: 4.4, In Stock
19. Jump Rope - $9.99, Rating: 4, In Stock
20. Ab Roller - $19.99, Rating: 4.2, In Stock
21. Blender - $49.99, Rating: 4.2, In Stock
22. Air Fryer - $89.99, Rating: 4.6, In Stock
23. Microwave Oven - $129.99, Rating: 4.5, Out of Stock
24. Coffee Maker - $79.99, Rating: 4.3, In Stock
25. Toaster - $29.99, Rating: 4.1, In Stock
26. Electric Kettle - $39.99, Rating: 4.4, In Stock
27. Rice Cooker - $59.99, Rating: 4.3, In Stock
28. Pressure Cooker - $99.99, Rating: 4.7, In Stock
29. Dishwasher - $549.99, Rating: 4.6, Out of Stock
30. Refrigerator - $999.99, Rating: 4.8, Out of Stock
31. Novel: The Great Adventure - $14.99, Rating: 4.3, In Stock
32. Programming Guide - $49.99, Rating: 4.7, In Stock
33. Cookbook: Easy Recipes - $24.99, Rating: 4.5, In Stock
34. History of Science - $39.99, Rating: 4.6, In Stock
35. Self-Help Guide - $19.99, Rating: 4.2, In Stock
36. Fantasy Novel - $9.99, Rating: 4.1, In Stock
37. Biography: An Inspiring Life - $29.99, Rating: 4.4, In Stock
38. Mystery Novel - $19.99, Rating: 4.3, In Stock
39. Children's Picture Book - $12.99, Rating: 4.5, In Stock
40. Science Fiction Novel - $17.99, Rating: 4.2, In Stock
```
