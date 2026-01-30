import { Layout } from "@/components/Layout";
import { useSearchHistory } from "@/hooks/use-parking";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isToday, isYesterday } from "date-fns";
import { MapPin, Clock, History as HistoryIcon, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function groupHistory(history: any[]) {
  const today: any[] = [];
  const yesterday: any[] = [];
  const older: any[] = [];

  history.forEach((item) => {
    const date = new Date(item.created_at);
    if (isToday(date)) today.push(item);
    else if (isYesterday(date)) yesterday.push(item);
    else older.push(item);
  });

  return { today, yesterday, older };
}

export default function History() {
  const { data: history, isLoading } = useSearchHistory();

  const grouped = history ? groupHistory(history) : { today: [], yesterday: [], older: [] };

  const navigateTo = (query: string) => {
    window.location.href = `/map?search=${encodeURIComponent(query)}`;
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <HistoryIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Search History</h1>
            <p className="text-muted-foreground">Your recent parking searches</p>
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && (!history || history.length === 0) && (
          <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/20">
            <HistoryIcon className="h-14 w-14 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-semibold">No history yet</h3>
            <p className="text-muted-foreground">Your searches will appear here</p>
          </div>
        )}

        {/* HISTORY LIST */}
        <AnimatePresence>
          {grouped.today.length > 0 && (
            <HistorySection title="Today" items={grouped.today} onNavigate={navigateTo} />
          )}
          {grouped.yesterday.length > 0 && (
            <HistorySection title="Yesterday" items={grouped.yesterday} onNavigate={navigateTo} />
          )}
          {grouped.older.length > 0 && (
            <HistorySection title="Older" items={grouped.older} onNavigate={navigateTo} />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

function HistorySection({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: any[];
  onNavigate: (q: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-muted-foreground">{title}</h2>

      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="p-5 flex items-center justify-between gap-4 hover:shadow-lg transition-all border border-border/50 rounded-2xl">
            
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h3 className="font-bold text-lg">{item.query}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>{item.city || "Unknown City"}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(new Date(item.created_at), "hh:mm a")}
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              className="rounded-xl gap-2"
              onClick={() => onNavigate(item.query)}
            >
              <Navigation className="h-4 w-4" />
              View on Map
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
