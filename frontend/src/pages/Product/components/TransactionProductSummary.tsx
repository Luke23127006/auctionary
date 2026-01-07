import { Link } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/card";
import { ImageWithFallback } from "../../../components/ImageWithFallback";

interface ProductData {
  id: number;
  image: string;
  title: string;
  endDate: string;
  category: string;
  winningBid: number;
  slug: string;
}

interface TransactionProductSummaryProps {
  product: ProductData;
}

export function TransactionProductSummary({
  product,
}: TransactionProductSummaryProps) {
  return (
    <Link to={`/products/${product.id}`} className="block">
      <Card className="border-border hover:border-accent/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg mb-1">{product.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Auction Ended: {product.endDate}</span>
                <span>•</span>
                <span>Category: {product.category}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                Winning Bid
              </div>
              <div className="text-2xl text-accent">
                ${product.winningBid.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
