# sharehouse
A simple web app for storing and splitting receipts in a sharehouse

Note. This document is still a work in progress and may be missing sections or steps.

## Table of Contents
- [Features](#features)
	- [Coming Soon](#comming-soon)
- [Screenshots](#screenshots)
- [Tech](#tech)
- [Setup](#setup)
	- [Download and install required software](#1-download-and-install-required-software)
	- [Download sharehouse source](#2-download-sharehouse-source)
	- [Configure back-end server](#3-configure-back-end-server)
	- [Run back-end server](#4-run-back-end-server)
	- [Build front-end client](#5-build-front-end-client)
	- [Move front-end client](#6-move-front-end-client)
- [License](#license)

## Features
- Receipt tracking and history
- Payment tracking and history
- Email and Push notifications
- Automatic cost distribution
- Distribution offsets
- Automatic debt balancing
- Password authentication
- Clean and minimalistic UI
- Mobile optimized
- Rich JSON REST API
- JWT session management
- Easy configuration via .env file

### Comming Soon
- Spending statistics
- Dark theme
- Setup script

## Screenshots
*coming soon*

## Tech
| Name | Description |
| --- | --- |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Password-hashing library |
| [Express](https://expressjs.com/) | Back-end web app framework |
| [Knex.js](https://knexjs.org/) | SQL query builder |
| [MySQL](https://www.mysql.com/) | Relational database management system |
| [Node.js](https://nodejs.org/) | Back-end JavaScript runtime environment |
| [Nodemailer](https://nodemailer.com/about/) | Node library for sending e-mails |
| [React](https://reactjs.org/) | JavaScript library for building user interfaces |
| [reactstrap](https://reactstrap.github.io/) | React component library for Bootstrap |
| [web-push](https://www.npmjs.com/package/web-push) | Node library for sending push notifications |

## Setup
For this simple deployment, we will use [nginx](https://www.nginx.com/) as a reverse proxy as well as to serve the front-end client. Additionally we will use the [pm2](https://pm2.keymetrics.io/) node package to serve the api. Tested on Ubuntu 21.10.

### 1. Download and install required software
```console
sudo apt update
sudo apt install nodejs nginx mysql-server
npm install pm2 -g
```

### 2. Download `sharehouse` source
```console
git clone https://github.com/JaydenGrubb1/sharehouse.git
cd sharehouse
```

<!-- TODO packages need installing first -->
### 3. Generate VAPID keys
```console
node server/gen-vapid.js
```
Example output:
```javascript
{
	publicKey: 'BIqoBJhEX9Exp9XOUu1lsB6MNti_Wz_6p0OB5WRowD9NebjIiixltxmBYzWzoLQemuqYmaRvU7QiW9e0-AK2Jrk'
	privateKey: 'PeIapvjJO2VMEkoFbi95gtPo3kF0YcrNYY0_Yr_xVm4'
}
```

### 3. Configure back-end server
```console
cp docs/example.env server/.env
nano server/.env
```
Change the values of the variables in the `.env` file as needed, using the comments as a guide.

### 4. Run back-end server
```console
cd server
npm install --production
sudo pm2 start "npm run production" --name "api"
sudo pm2 save
cd ../
```
You can test if the back-end is running and working by going to the test page in your browser. By default this can be found at http://localhost:3001/test

Example output in browser:
```javascript
{
	"error": false,
	"message": "Test completed succesfully at 3/1/2022, 7:23:34 AM"
}
```

### 5. Build front-end client
```console
cd client
npm install --production
npm run build
cd ../
```

### 6. Move front-end client
```console
mkdir /var/www/sharehouse
mv client/build /var/www/sharehouse/html
```
```console
sudo systemctl restart nginx
```

## License
[BSD-3-Clause License](LICENSE)



<!-- https://gist.github.com/zkiraly/c378a1a43d8be9c9a8f9 -->
<!-- To Restore delete docker branch
```console
git checkout -b docker archive/docker
``` -->