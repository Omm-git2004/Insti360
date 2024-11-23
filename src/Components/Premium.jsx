import { useSelector } from "react-redux"
import PremiumCard from "./PremiumCard"

export default () => {

    const { data: instituteData } = useSelector(state => state.institute)
    const premiumCards = [
        { price: 200, discount: 12, duration: 1, benefits: ["Teacher can use AI to prepare questions", "Student can upload pdf"] },
        { price: 850, discount: 32, duration: 3, benefits: ["Teacher can use AI to prepare questions", "Student can upload pdf"] },
        { price: 2000, discount: 52, duration: 6, benefits: ["Teacher can use AI to prepare questions", "Student can upload pdf"] }
    ]

    return (
        <div>
            {
                instituteData.premiumInfo?.isPremium
                    ? ""
                    : <p>No Premium Access</p>
            }
            {
                premiumCards.map((premiumCard, index) => (
                    <PremiumCard premiumCardData={premiumCard} key={index} />
                ))
            }
        </div>
    )
}