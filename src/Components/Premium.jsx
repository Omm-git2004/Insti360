import { useSelector } from "react-redux";
import PremiumCard from "./PremiumCard";

export default () => {
    const { data: instituteData } = useSelector((state) => state.institute);

    const premiumCards = [
        {
            price: 200,
            discount: 12,
            duration: 1,
            benefits: ["Teacher can use AI to prepare questions", "Student can upload PDFs"],
        },
        {
            price: 850,
            discount: 32,
            duration: 3,
            benefits: ["Teacher can use AI to prepare questions", "Student can upload PDFs"],
        },
        {
            price: 2000,
            discount: 52,
            duration: 6,
            benefits: ["Teacher can use AI to prepare questions", "Student can upload PDFs"],
        },
    ];

    // Check if the user has purchased a premium plan
    const userPremiumPlan = instituteData?.premiumInfo?.isPremium
        ? premiumCards.find(
              (card) => card.duration === instituteData.premiumInfo.duration
          )
        : null;

    return (
        <div className="premium-page">
            <h1 className="premium-header">Premium Plans</h1>
            <p className="premium-subtext">
                Unlock the full potential of <strong>insti360.com</strong> with exclusive benefits!
            </p>

            {/* Section for the user's purchased premium plan */}
            {userPremiumPlan 
            ? (
                <div className="user-premium-section">
                    <h2 className="premium-header">Your Current Premium Plan</h2>
                    <PremiumCard premiumCardData={userPremiumPlan} />
                </div>
            )
            : <div className="user-premium-section">
                <h2>You have no Premium Access. </h2>
            </div>
        }

            {/* Section for all available premium plans */}
            <div className="available-premium-section">
                <h2 className="premium-header">Explore All Plans</h2>
                <div className="premium-cards-container">
                    {premiumCards.map((premiumCard, index) => (
                        <PremiumCard premiumCardData={premiumCard} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};
