# CampusBites 🍔

> **One Group. One Cart. Everyone Orders.**
> A web app for university students to order food together and split the bill.

## Features

**Phase 1**
- Squad group ordering with a shared cart (demo code `CB-7X2W`)
- Automatic bill splitter (per-member subtotal + shared delivery charge)
- Outlet browsing, outlet-wise menus and outlet search
- Responsive layout (desktop / tablet / mobile)

**Phase 2**
- Multiple pages, linked together: Home, Outlets, Menu, Group Order, Checkout, Login, Sign Up, Contact
- JavaScript interactions: inline form validation, quantity +/- controls, toast notifications, live search with "no results", active nav highlighting, cart saved between pages
- Real form submission using `fetch()` to a Node.js server
- Form data saved to local JSON files in `/data`

## Tech

HTML5 · CSS3 · Vanilla JavaScript · Node.js (built-in `http` module, **no npm packages needed**)

## Run locally

Requires [Node.js](https://nodejs.org) 16 or newer.

```bash
git clone https://github.com/WB-Campusbites/campsites-web.git
cd campsites-web
npm start
```

Open http://localhost:3000

> Open the site through `npm start`, not by double-clicking the HTML files, otherwise forms cannot reach the server.

## Project structure

```
├── server.js          # web server + API + JSON file saving
├── package.json
├── data/
│   ├── users.json     # sign-ups (passwords are salted + hashed)
│   ├── orders.json    # placed orders (group + separate)
│   └── contacts.json  # contact / feedback messages
└── public/
    ├── index.html     # Home, Outlets, Menu, Group Order sections
    ├── login.html  signup.html  contact.html  checkout.html
    ├── style.css
    ├── common.js      # toasts, validation helpers, navbar login state
    ├── forms.js       # signup / login / contact / checkout forms
    └── script.js      # carts, bill splitter, outlet menus, search
```

## API

| Method | Route | Saves to |
|---|---|---|
| POST | `/api/signup` | `data/users.json` |
| POST | `/api/login` | (reads `users.json`) |
| POST | `/api/orders` | `data/orders.json` |
| POST | `/api/contact` | `data/contacts.json` |

All inputs are validated in the browser **and** again on the server.
