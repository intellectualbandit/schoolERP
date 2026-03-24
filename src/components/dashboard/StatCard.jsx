import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export default function StatCard({ label, value, icon: Icon, color, bgColor, change, changeType, subtitle }) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold tracking-tight leading-none">{value}</p>
            {change && (
              <div className="flex items-center gap-1 pt-0.5">
                {changeType === 'up' ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {change}
                </span>
                {subtitle && <span className="text-[11px] text-muted-foreground">{subtitle}</span>}
              </div>
            )}
            {!change && subtitle && (
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${bgColor}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
