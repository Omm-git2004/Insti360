export default ({ premiumCardData }) => {

    const { duration, price, discount, benefits } = premiumCardData;

    return (
        <div>
            Duration : {duration}
            Discount : {discount}
            Price : <p style={{ textDecoration: "line-through" }} >{price}</p> {price - Math.floor((price * discount) / 100)}
            Benefits : <ul>
                {
                    benefits.map(benefit => (
                        <li key={benefit}>{benefit}</li>
                    ))
                }
            </ul>
        </div>
    )
}