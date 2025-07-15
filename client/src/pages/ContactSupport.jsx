import React, { useState } from 'react';
import './ContactSupport.css';

function App() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement submission logic here
    alert('Query submitted!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="main-bg">
      <div className="container">
        <h1>Support & Help Center</h1>
        <div className="card">
          <h2>Contact Support</h2>
          <form className="support-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Describe your issue..."
              value={form.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Submit Query</button>
          </form>
        </div>

        <div className="card">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>How does Bring Me Home work?</h3>
            <p>
              Bring Me Home connects travelers with people who need to send small packages internationally. Travelers carry items for a tip and follow TSA guidelines.
            </p>
          </div>
          <div className="faq-item">
            <h3>How can I verify my profile?</h3>
            <p>
              Go to your profile settings and click on "Verify Profile". Follow the instructions and submit valid documents.
            </p>
          </div>
          <div className="faq-item">
            <h3>What happens if my item is not delivered?</h3>
            <p>
              Payment is held in escrow until delivery is confirmed. If the item is not delivered, you can raise a dispute from your Payments page.
            </p>
          </div>
          <div className="faq-help">
            Need more help? Email us at <a href="mailto:support@bringmehome.com">support@bringmehome.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
