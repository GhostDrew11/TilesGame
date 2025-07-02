import type { CardData } from "../utils/constants/type";

type CardProps = {
  card: CardData;
};

const Card = ({ card }: CardProps) => {
  return (
    <div className="card">
      <img src={card.imageUrl} alt={card.title} />
      <p>{card.title}</p>
    </div>
  );
};

export default Card;
