# Firebase Firestore Security Rules (Production Lockdown)

Paste these rules in your **Firebase Console** (https://console.firebase.google.com):
1. Go to **Firestore Database** in the left sidebar.
2. Click on the **Rules** tab at the top.
3. Replace everything with the rules below and click **Publish**.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to verify admin identity
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email == "kundanmahato14499@gmail.com"
      );
    }

    // 1. Portfolio Data (Hero, About, Projects, Skills, Experience, Testimonials)
    // - Anyone can READ your portfolio data.
    // - ONLY Kundan (authenticated admin) can edit or delete.
    match /portfolio_data/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // 2. Admin Credentials Configuration
    // - Strictly private! Only authenticated admin can read or write.
    match /admin_config/{document} {
      allow read, write: if isAdmin();
    }

    // 3. Contact Form Messages
    // - Anyone can submit a message (validated text fields, <= 3000 chars).
    // - ONLY the authenticated admin can view, delete, or manage messages.
    match /messages/{document} {
      allow create: if true 
        && request.resource.data.name is string 
        && request.resource.data.message is string
        && request.resource.data.message.size() <= 3000;
      allow read, update, delete: if isAdmin();
    }

    // 4. Visitor Analytics & Traffic Tracking
    // - Visitors can log hits (create & update view counters).
    // - ONLY the authenticated admin can read detailed visitor statistics or clear history.
    match /portfolio_analytics/{document} {
      allow create, update: if true;
      allow read, delete: if isAdmin();
    }
  }
}
```

---

## What Does This Protect You Against?

1. **Database Defacement / Wipeout:**
   Even if an attacker discovers your Firebase API keys in browser network traffic, Firebase's cloud servers will **instantly REJECT** any attempt to edit or delete your portfolio data without your authenticated admin credentials (`kundanmahato14499@gmail.com`).
2. **Message Privacy:**
   No visitor can read the confidential messages or contact inquiries sent to you by other clients.
3. **Admin Credential Secrecy:**
   No unauthorized user can query or modify your admin configurations.
4. **Visitor Traffic Recording:**
   Visitors can increment view counts without needing admin logins, but only you can read the visitor logs.
