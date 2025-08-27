import { Card, CardContent } from '../ui/card';

export const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'up',
  className = '' 
}) => {
  const trendColor = trend === 'up' 
    ? 'text-success' 
    : trend === 'down' 
    ? 'text-destructive' 
    : 'text-muted-foreground';

  return (
    <Card className={`dashboard-card ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {value}
            </p>
            {change && (
              <p className={`text-sm font-medium ${trendColor} flex items-center space-x-1`}>
                <span>{change}</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </p>
            )}
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};