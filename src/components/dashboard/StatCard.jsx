import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export default function StatCard({ label, value, icon: Icon, color, bgColor, change, changeType, subtitle }) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === 'up' ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {change}
                </span>
                {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
              </div>
            )}
          </div>
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${bgColor}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
