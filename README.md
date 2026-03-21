# E-Commerce
A small e-commerce project for my sister

# To Do
- Orders PDF-JSON File upload problem
- Products PDF-JSON File upload problem
- Order many different products at once -> association class (quantity attribute) to capture N-N group by => create junction table or relation (or bi-allocate foreign keys) -> no need for a junction table or forein keys bi-allocation because we used compounded data values, forbidden in databases, in the table to avoid reference overhead
    - If only one stock unit of a product remains, no need to ask about quantity (optional)
- Fix Product ID system: decouple products of the same name into product.stock many products with the same name (optional)
- Fix order edit merge customers with same values (optional)
- If an order is added with same customer name and phone, merge orders in one (optional, not recommended)
- Add Customer/Client Management System on its own (like order and products and expenses) with more in-depth details
- Add more products attributes (data model): version and gender
- Add more orders attributes (data model)
- Add more customer attributes (data model)
- Add more expenses attributes (data model)
- Add more analytics metrics breakdown by field (finance, accounting, marketing, business, management) for better financial-accounting accuracy (target: fine-grained accuracy) -> useful for simulation, prediction, extrapolation, hindcast, forecast and decision-making (provisioning)
- APIs to make automated campaign product posts on various social medias from the click of a button 
- API for local market price estimation (priceData) or create a new one using flask + beautifulsoup for web scraping (avito, jumia, marjanemall, lemarketprice)
- For moroccan markets: add search by category, brand, version and image (not just name)
- Add more classes/entites for realistic data models
- Algorithmic Optimization: stock scalability (linear->logarithmic)
- Might replace localStorage by indexedDB (high storage capacity, allows complex data types like objects, async) or actual backend database (PHP's mysqli) or JSON files: localStorage can work in production (remote hosting) too but the risks are if the user clears it manually by mistake or use another browser or machine, insecurity, limited storage (5-10 MB), etc. => most likely solution: replace localStorage by indexedDB (still client-side or browser storage) + download data in the form of JSON or export PDF every once in a while. 
- Choose a secure, robust, reliable and scalable hosting plan (local vs remote: which remote if remote) => most likely solution: static hosting
--> Solution: 
    - Storage: File Storage (JSON file + PDF export) + Client-Side storage (browser storage: localStorage (data structure) or indexedDB (database) -> exploiting Same-Origin Policy + stored on the browser's local cache on the machine -> no hardcoded data) => additional assurance: diversification through horizontal scaling (more than one machine storing data through voluntary peer-to-peer exchange of JSON files) as opposed to vertical scaling (file -> db or data structure to db)
    - Hosting: Static Hosting (Github pages)
- Develop customer-side version to streamline ordering + webhook notification system (supplier handle products only, let the customers make their own orders/demands directly from the site)