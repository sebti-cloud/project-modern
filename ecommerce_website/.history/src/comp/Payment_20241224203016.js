import React from 'react';

const Payment = () => {
  return (
    <section className="payment-section">
        <div className="container">
            <div className="payment-wrapper">
                <div className="payment-left">
                    <div className="payment-header">
                        <div className="payment-header-icon"><i className="ri-flashlight-fill"></i></div>
                        <div className="payment-header-title">Order Summary</div>
                        <p className="payment-header-description">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                    </div>
                    <div className="payment-content">
                        <div className="payment-body">
                            <div className="payment-plan">
                                <div className="payment-plan-type">Pro</div>
                                <div className="payment-plan-info">
                                    <div className="payment-plan-info-name">Professional Plan</div>
                                    <div className="payment-plan-info-price">$49 per month</div>
                                </div>
                                <a href="#" className="payment-plan-change">Change</a>
                            </div>
                            <div className="payment-summary">
                                <div className="payment-summary-item">
                                    <div className="payment-summary-name">Additional fee</div>
                                    <div className="payment-summary-price">$10</div>
                                </div>
                                <div className="payment-summary-item">
                                    <div className="payment-summary-name">Discount 20%</</div>
                                    <div className="payment-summary-price">-$10</div>
                                </div>
                                <div className="payment-summary-divider"></div>
                                <div className="payment-summary-item payment-summary-total">
                                    <div className="payment-summary-name">Total</div>
                                    <div className="payment-summary-price">-$10</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="payment-right">
                    <form action="" className="payment-form">
                        <h1 className="payment-title">Payment Details</h1>
                        <div className="payment-method">
                            <input type="radio" name="payment-method" id="method-1" defaultChecked />
                            <label htmlFor="method-1" className="payment-method-item">
                                <img src="images/visa.png" alt="" />
                            </label>
                            <input type="radio" name="payment-method" id="method-2" />
                            <label htmlFor="method-2" className="payment-method-item">
                                <img src="images/mastercard.png" alt="" />
                            </label>
                            <input type="radio" name="payment-method" id="method-3" />
                            <label htmlFor="method-3" className="payment-method-item">
                                <img src="images/paypal.png" alt="" />
                            </label>
                            <input type="radio" name="payment-method" id="method-4" />
                            <label htmlFor="method-4" className="payment-method-item">
                                <img src="images/stripe.png" alt="" />
                            </label>
                        </div>
                        <div className="payment-form-group">
                            <input type="email" placeholder=" " className="payment-form-control" id="email" />
                            <label htmlFor="email" className="payment-form-label payment-form-label-required">Email Address</label>
                        </div>
                        <div className="payment-form-group">
                            <input type="text" placeholder=" " className="payment-form-control" id="card-number" />
                            <label htmlFor="card-number" className="payment-form-label payment-form-label-required">Card Number</label>
                        </div>
                        <div className="payment-form-group-flex">
                            <div className="payment-form-group">
                                <input type="date" placeholder=" " className="payment-form-control" id="expiry-date" />
                                <label htmlFor="expiry-date" className="payment-form-label payment-form-label-required">Expiry Date</label>
                            </div>
                            <div className="payment-form-group">
                                <input type="text" placeholder=" " className="payment-form-control" id="cvv" />
                                <label htmlFor="cvv" className="payment-form-label payment-form-label-required">CVV</label>
                            </div>
                        </div>
                        <button type="submit" className="payment-form-submit-button"><i className="ri-wallet-line"></i> Pay</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Payment;
