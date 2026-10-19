# Geo trips: website planning.



Geo trips is a travel agency. It provides the following services:

* Online air ticketing: Both local and international. users call us, we check within the private systems of websites and offer them our price:
* Visa assistance: users call us regarding which country of visa they want. We tell them what documents are required, how much time and what will be the cost .
* Tour packages: users call us regarding their tour description. We make some plans of our own by calling vendors or using the data available to us. Then we send them to the client. We make a detailed document where the costing of each element along with which day offers what are listed there. Then after some communication with them, we send them the final invoice and they accept that.
* Hajj and umrah package: similar to tour packages but here our vendors are different.
* Hotel booking : clients tell us which hotels they want or what filters, then we search and tell them the price.

we also have some of our administrative works.

1. we have to store data for every client. That should include fields of the passports. Also we have dedicated google drive folder for each client. so a link to that folder should also be stored.
2. we make invoices. sometimes we have to merge different payments into a single invoice. this payments can be of multiple categories depending on what service the client took.
3. we have to track all the payments we received and we did.  clients doesn't always make full payment. So we have to track which payment was for which service and how much is left. also which client has how much due. For our own payments, we usually purchase from vendors, so also need to track how much we told the client and how much was the cost from vendor
4. the visa is entirely given to vendors. so we store how much we the vendor took and how much the client agreed on. 



all the payment related info are right now maintained within an excel sheet. 

we plan to use this website for multiple reasons: 

1. the clients should have get the feeling that we are not any backdated company. we are modern and trusted. 
2. users should get important information just by visiting our website. this can be things like notices, visa document list with cost, hotel lists and maybe making a plan of themselves. 
3. users being able to see their own data like tickets they purchased from us, visa they applied via us, status etc. payment status can also be checked from the website. example: user makes a payment via bank and submits the document picture via website. admin sees them and later verifies it. 











You are an expert Full-Stack Web Developer and UI/UX Designer. Your task is to build a complete, production-ready, fully functional web application for a modern travel agency named "Geo trips". 



The website must look highly professional, trustworthy, and modern (not backdated) to instill confidence in clients. It needs a beautiful frontend for users and a powerful backend/CRM for administrators to replace their current Excel-based workflow.



TECH STACK (100% Free Tier Deployable):

\- Framework: Next.js (App Router) using React and TypeScript.

\- Styling: Tailwind CSS + Shadcn UI or Framer Motion for beautiful, modern animations.

\- Database \& Authentication: Supabase (Free tier provides PostgreSQL, Auth, and Storage for image uploads).

\- Hosting: Vercel (Free tier for seamless Next.js deployment).



Please generate the necessary project structure, database schema, and core code for the following features:



1\. DATABASE SCHEMA \& ROLES (Supabase PostgreSQL)

\- Users Table: standard user info, Role (Admin or Client), Passport Details (Passport Number, Expiry, Nationality), and a specific field for a "Client Google Drive Folder Link".

\- Services/Products Table: Notices, Visa Document Lists \& Costs, Hotel Lists, Tour Packages, Hajj \& Umrah Packages.

\- Bookings/Orders Table: Links Client ID to a Service. Tracks Booking Status.

\- Invoices Table: Can merge multiple payments/services into one master invoice.

\- Payments Table (CRITICAL): Must replace an Excel sheet. Fields include: Client ID, Service ID, Total Client Price, Total Vendor Cost, Amount Paid by Client, Amount Due, Vendor Name, Payment Status.

\- Payment Verifications Table: For clients to upload bank transfer receipts (images) for Admin approval.



2\. PUBLIC FRONTEND (Client-Facing)

\- Modern Landing Page: Hero section with animated elements, Trust badges, Testimonials, and quick links to services.

\- Informational Hub: Dynamic pages for Notices, Visa Document Checklists \& Costs, Hotel directories, and detailed itineraries for Tour/Hajj/Umrah packages.

\- Interactive Trip Planner (Bonus Feature): A fun, step-by-step interactive form (wizard) where users input their dream destination, budget, and dates, which outputs a rough estimate and sends a lead to the admin.



3\. SECURE CLIENT DASHBOARD (Logged-In Users)

\- Profile Management: Users can securely add/update their passport details.

\- My Trips \& Services: View purchased air tickets, active tour packages, and live visa application statuses.

\- Financials: View generated invoices, see total dues, and check payment statuses.

\- Payment Uploads: A form for users to upload pictures/receipts of their bank transfers to notify the admin of a payment.



4\. ADMIN PORTAL (Staff/Management)

\- CRM \& User Management: View all clients, their passport data, and easily access their dedicated Google Drive folder links.

\- Inquiry \& Booking Manager: Process incoming air ticketing requests, hotel filters, and trip planner leads. Issue custom price quotes.

\- Advanced Financial Dashboard: Track all payments. Easily see "Client Price vs. Vendor Cost" to calculate profit margins. See who owes money (Dues). 

\- Invoice Generator: A tool to select multiple payments/services for a single client and generate a clean, unified invoice.

\- Payment Verification: An inbox to review client-uploaded bank receipts and manually mark their digital invoices as "Paid".

\- Vendor Management: Keep track of third-party vendors (for visas, hotels, packages) and how much is owed to them.



Please begin by outlining the file structure and the Supabase SQL schema. Then, provide the code for the main layout, the database connection utility, the Client Dashboard layout, and the Admin Financial Tracker component. Ensure all UI elements use a sleek, modern color palette suitable for a premium travel agency (e.g., deep ocean blues, crisp whites, and gold/teal accents).

