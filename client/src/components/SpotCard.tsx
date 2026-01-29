import { ParkingPrediction } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Car, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpotCardProps {
  spot: ParkingPrediction;
  isSelected: boolean;
  onClick: () => void;
}

export function SpotCard({ spot, isSelected, onClick }: SpotCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2",
        isSelected 
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
          : "border-transparent hover:border-border"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg font-display">{spot.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {spot.distance} away
          </p>
        </div>
        <Badge 
          className={cn(
            "font-semibold",
            spot.probability === "High" ? "bg-green-500/15 text-green-700 hover:bg-green-500/25" :
            spot.probability === "Medium" ? "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25" :
            "bg-red-500/15 text-red-700 hover:bg-red-500/25"
          )}
        >
          {spot.probability} Chance
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-background rounded-lg p-2 flex items-center gap-2 border border-border/50">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{spot.walkingTime}</span>
        </div>
        <div className="bg-background rounded-lg p-2 flex items-center gap-2 border border-border/50">
          <Car className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{spot.availableSpaces} spots</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {spot.legalStatus}
        </span>
        <Button 
          size="sm" 
          variant={isSelected ? "default" : "secondary"}
          className="h-8"
        >
          Details
        </Button>
      </div>
    </Card>
  );
}
