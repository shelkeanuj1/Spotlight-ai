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
        "p-5 cursor-pointer transition-all duration-300 border-2 relative overflow-hidden group",
        isSelected 
          ? "border-primary bg-primary/[0.03] shadow-xl shadow-primary/10 scale-[1.02] z-10" 
          : "border-transparent hover:border-primary/20 hover:bg-muted/30"
      )}
    >
      {isSelected && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
        />
      )}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="font-bold text-xl font-display tracking-tight group-hover:text-primary transition-colors">{spot.name}</h3>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {spot.distance}
            </p>
            <p className="text-xs font-bold text-primary/80 uppercase tracking-widest">{spot.trafficDensity} Traffic</p>
          </div>
        </div>
        <Badge 
          className={cn(
            "font-bold px-3 py-1 rounded-full shadow-sm",
            spot.probability === "High" ? "bg-green-500 text-white hover:bg-green-600" :
            spot.probability === "Medium" ? "bg-yellow-500 text-white hover:bg-yellow-600" :
            "bg-red-500 text-white hover:bg-red-600"
          )}
        >
          {spot.probability}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 flex flex-col gap-1 border border-border/40 shadow-inner group-hover:bg-background transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Walk Time</span>
          </div>
          <span className="text-base font-black">{spot.walkingTime}</span>
        </div>
        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 flex flex-col gap-1 border border-border/40 shadow-inner group-hover:bg-background transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Car className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Availability</span>
          </div>
          <span className="text-base font-black">{spot.availableSpaces} spots</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-2 w-2 rounded-full",
            spot.availableSpaces > 5 ? "bg-green-500" : "bg-yellow-500"
          )} />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {spot.legalStatus}
          </span>
        </div>
        <Button 
          size="sm" 
          variant={isSelected ? "default" : "outline"}
          className={cn(
            "h-9 px-6 rounded-xl font-bold transition-all",
            isSelected ? "shadow-lg shadow-primary/20" : "hover:bg-primary hover:text-white"
          )}
        >
          {isSelected ? "Navigating" : "Park Here"}
        </Button>
      </div>
    </Card>
  );
}
