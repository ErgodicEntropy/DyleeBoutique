# E-Commerce
A small e-commerce project for my sister

# To Do
- FIX ALL INTERDEPENDENCE ISSUES BETWEEN ENTITIES: Product->Order, Product->Expense, Order->Customer, Dashboard->Order*Customer
- Orders PDF-JSON File upload problem
- Products PDF-JSON File upload problem
- Order many different products at once -> association class (quantity attribute) to capture N-N group by => create junction table or relation (or bi-allocate foreign keys) -> no need for a junction table or forein keys bi-allocation because we used compounded data values, forbidden in databases, in the table to avoid reference overhead
    - If only one stock unit of a product remains, no need to ask about quantity (optional)
- Fix Product ID system: decouple products of the same name into product.stock many products with the same name (optional)
- Fix order edit merge customers with same values (optional)
- If an order is added with same customer name and phone, merge orders in one (optional, not recommended)
- Add Customer/Client Management System on its own (like order and products and expenses) with more in-depth details
- Add more products attributes (data model): version
- Add more orders attributes (data model)
- Add more customer attributes (data model)
- Add more expenses attributes (data model)
- Add more analytics metrics breakdown by field (finance, accounting, marketing, business, management) for better financial-accounting accuracy (target: fine-grained accuracy) -> useful for simulation, prediction, extrapolation, hindcast, forecast and decision-making (provisioning)
- APIs to make automated campaign product posts on various social medias from the click of a button 
- API for local market price estimation (priceData) or create a new one using flask + beautifulsoup for web scraping (avito, jumia, marjanemall, lemarketprice)
- For moroccan markets: add search by category, brand and version (not just name)
- Add more classes/entites for realistic data models
- Might replace localStorage by indexedDB or actual backend database (PHP's mysqli) or JSON files: localStorage can work in production (remote hosting) too but the risks are if the user clears the cookies by mistake or use another browser or machine, expiration, insecurity, limited storage, etc.
- Choose a secure, robust, reliable and scalable hosting plan (local vs remote: which remote if remote)
- Develop customer-side version to streamline ordering + webhook notification system (supplier handle products only, let the customers make their own orders/demands directly from the site)