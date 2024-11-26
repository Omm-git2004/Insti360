export default ({ premiumCardData }) => {
    const { duration, price, discount, benefits } = premiumCardData;

    const discountedPrice = price - Math.floor((price * discount) / 100);

    // Determine background color based on price and duration
    const getBackgroundColor = () => {
        if (duration === 1) return "#ffe4e1"; // Light red for 1-month
        if (duration === 3) return "#e0f7fa"; // Light blue for 3-months
        if (duration === 6) return "#e8f5e9"; // Light green for 6-months
        return "#f5f5f5"; // Default light gray
    };

    return (
        <div
            className="premium-card"
            style={{ backgroundColor: getBackgroundColor() }}
        >
            <h2 className="card-duration">{duration} Month{duration > 1 ? "s" : ""}</h2>
            <div className="card-price">
                <p className="original-price">₹{price}</p>
                <p className="discounted-price">₹{discountedPrice}</p>
            </div>
            <p className="card-discount">Save {discount}%!</p>
            <ul className="card-benefits">
                {benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                ))}
            </ul>
            <button className="upgrade-button">Upgrade Now</button>
        </div>
    );
};
