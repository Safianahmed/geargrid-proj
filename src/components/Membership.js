import React from "react";
import "../css/Membership.css";

const Membership = () => {
  const plans = [
    {
      title: "$9.99/month Basic Membership",
      features: [
        "Listed in the GearGrid Business Directory",
        "Appear in relevant search results",
        "Add business details, website, and contact info",
        "Post one promotional offer per month",
        "Cancel anytime",
      ],
      buttonText: "SIGN UP FOR BASIC MONTHLY",
    },
    {
      title: "$9.99/month Premium Membership",
      features: [
        "Everything in the Basic Plan, PLUS:",
        "Priority listing - Appear higher in searches every month",
        "Unlimited promotional posts & offers",
        "Featured Business Badge - Stand out from competitors",
        "Early access to GearGrid-exclusive events",
      ],
      buttonText: "SIGN UP FOR PREMIUM MONTHLY",
    },
    {
      title: "$99/year Basic Membership - Save $20!",
      features: [
        "Everything in Basic Monthly, PLUS:",
        "Lower cost per year compared to monthly",
        "Priority support for listing changes",
      ],
      buttonText: "SIGN UP FOR BASIC YEARLY",
    },
    {
      title: "$149/year Premium Membership - Save $30!",
      features: [
        "Everything in Premium Monthly, PLUS:",
        "One-time Featured Placement - Top of searches for 30 days",
        "Exclusive GearGrid Partner Status - Special platform perks",
        "VIP Support for business-related inquiries",
      ],
      buttonText: "SIGN UP FOR PREMIUM YEARLY",
    },
  ];

  return (
    <div className="membership-container">
      <h1>GET YOUR BUSINESS FEATURED</h1>
      <p>
        Join GearGrid's Business Directory and connect with thousands of car
        enthusiasts looking for trusted mechanics, detailers, parts sellers, and
        more. Whether you're a small shop or a large-scale provider, this is the
        perfect place to grow your customer base.
      </p>
      <h2>Membership Plans</h2>

      <div className="membership-grid">
        {plans.map((plan, index) => (
          <div className="membership-card" key={index}>
            <img src="/images/car-placeholder.jpg" alt="Membership" />
            <h3>{plan.title}</h3>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className="signup-button">{plan.buttonText}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;
