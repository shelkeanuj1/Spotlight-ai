import { Layout } from "@/components/Layout";
import { useSearchHistory } from "@/hooks/use-parking";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search as SearchIcon, MapPin, Calendar, Clock } from "lucide-react";

export default function History() {
  const { data: history, isLoading } = useSearchHistory();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Search History</h1>
          <p className="text-muted-foreground mt-1">Your recent parking searches and activities</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : history?.length ? (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="p-6 hover:shadow-md transition-shadow duration-200 border border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <SearchIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{item.query}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{parseFloat(item.latitude!).toFixed(4)}, {parseFloat(item.longitude!).toFixed(4)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{item.timestamp ? format(new Date(item.timestamp), 'MMM d, yyyy') : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground md:justify-end">
                       <Clock className="h-4 w-4" />
                       {item.timestamp ? format(new Date(item.timestamp), 'h:mm a') : 'N/A'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold text-lg">No history yet</h3>
            <p className="text-muted-foreground">Your recent searches will appear here</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
