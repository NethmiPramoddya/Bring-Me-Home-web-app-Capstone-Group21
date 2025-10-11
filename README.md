# Bring Me Home

![Tech Stack](https://img.shields.io/badge/stack-MERN-green)
![Chatbot](https://img.shields.io/badge/AI-Groq--API-purple)
![Payment](https://img.shields.io/badge/Payments-PayHere-orange)
![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-lightgrey)

A **full-stack MERN peer-to-peer international delivery platform** connecting senders with travelers for affordable and secure cross-border parcel delivery.

## Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Workflows](#-user-workflows)
- [AI Chatbot](#-ai-chatbot-groq-api)
- [Security](#-security)
- [Tech Stack](#️-tech-stack)
- [Project Setup](#️-project-setup)
- [Demo & Resources](#-demo--resources)
- [Author](#-author)

## Overview
**Bring Me Home** enables:
- **Senders** to post delivery requests for parcels abroad.
- **Travelers** to earn by carrying parcels along their travel routes.
- **Admins** to manage secure payments, delivery confirmations, and payouts.

> Developed as a **Capstone Project (Group 21)** 


## Key Features
- **Automated Matching System:** Connects senders & travelers based on countries, dates, and destinations using REST APIs.
- **Dynamic Tip Calculation:** $5 per kg (75% traveler share / 25% system fee).
- **PayHere Escrow System:** Ensures secure, automated payment handling.
- **Real-Time Chat:** Built with **Socket.io** for instant communication.
- **QR + OTP Delivery Verification:** Confirms successful parcel handover & triggers wallet updates.
- **Admin Dashboard:** Manage traveler wallets and verify withdrawals.
- **AI Chatbot:** Powered by **Groq API** for guided navigation and instant support.


## User Workflows

### As a Sender
1. **Register & Login**
2. **Fill Sender Request Form:**
   - Sender & Receiver details  
   - Parcel weight, buy link, delivery date, route, and special instructions  
3. System auto-calculates **tip** & **full cost**.  
4. Wait for a matching traveler.  
5. Once accepted → **Pay via PayHere**.  
6. Chat with the traveler & generate **QR Code + OTP**.  
7. Receiver scans QR + enters OTP → Delivery confirmed.  
8. Traveler’s wallet updates → Admin approves payout.

###  As a Traveler
1. **Register & Login**
2. **Fill Traveler Form:**
   - Departure/arrival countries, travel dates, luggage space  
   - Contact & social links  
3. Get **notified** when a sender matches your route.  
4. Accept request if interested.  
5. After sender payment → **Chat & coordinate delivery**.  
6. Deliver parcel → Receiver scans QR + enters OTP.  
7. Wallet updates → Admin verifies and approves payout.


## AI Chatbot (Groq API)
The **AI chatbot** assists users in:
- Registration & login  
- Sender & traveler workflow guidance  
- Tip calculation explanation  
- Payment walkthrough (PayHere integration)  
- QR / OTP / wallet process  
- Frequently asked questions  

> Built using **Groq API**.

## Security
- Encrypted **MongoDB Atlas** storage  
- Traveler & sender identity verification via **social media/contact details**  
- **QR + OTP-based** delivery authentication  
- Role-based access for **Admin controls**  
- Escrow payment system ensuring safety for both parties  


## Tech Stack
**Frontend:** React (Vite) + Tailwind CSS  
**Backend:** Node.js + Express + MongoDB  
**Real-Time:** Socket.io  
**Payments:** PayHere API  
**AI Assistant:** Groq API  
**Testing:** Ngrok (for local webhooks)  
**Hosting:** Vercel / Render / Ngrok  


## Project Setup

### Backend (Server)
```bash
cd server
npm install
npm start
# Runs on http://localhost:3002
```
### Client (Frontend)
```bash
cd client
npm install
npm run dev -- --port 5174
# Runs on http://localhost:5174
```
### Admin Panel
```bash
cd admin
npm install
npm run dev -- --port 5173
# Runs on http://localhost:5173
```
 ### Ngrok Setup
# Backend exposure
```poweshell run as a adminstratar
ngrok http http://localhost:3002
```
- paste the forwarding Url in frontend .env file

## Demo
[Watch LinkedIn Demo Video](https://www.linkedin.com/posts/nethmi-kathriarachchi-916bb7328_mern-capstoneproject-fullstackdevelopment-activity-7381304460368728064-DIwz?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFLCc2IBxLX4mcOGiVe7p5sZQ6XG3RoV3mo)

## GitHub Repository
[Bring Me Home (Capstone Group 21)](https://github.com/NethmiPramoddya/Bring-Me-Home-web-app-Capstone-Group21.git)

## Portfolio
[my-portfolio-sigma-two-42.vercel.app](https://my-portfolio-sigma-two-42.vercel.app/)

## GitHub Profile
[Nethmi Pramoddya](https://github.com/NethmiPramoddya/)

## LinkedIn
[Nethmi Kathriarachchi](https://www.linkedin.com/in/nethmi-kathriarachchi-916bb7328)


## Achievements

- Led development of **MERN full-stack capstone project**.  
- Built **sender–traveler matching algorithm** using REST APIs.  
- Integrated **PayHere payment gateway** with escrow-based payout logic.  
- Deployed **Socket.io chat** and **QR verification system**.  
- Created **AI-powered Groq chatbot** for interactive user guidance.  

## Author

**Nethmi Kathriarachchi**  
Full-Stack Developer | MERN Stack 

Email: nethmik2001@gmail.com 

[Portfolio](https://my-portfolio-sigma-two-42.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/nethmi-kathriarachchi-916bb7328/) | [GitHub](https://github.com/NethmiPramoddya/)


