import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Unit } from "@/lib/projectData";
import { 
  Building2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Bed,
  Dumbbell,
  Waves,
  Church,
  Shield,
  TreePine,
  Building,
  MapPin,
  Crown
} from "lucide-react";

interface UnitCardProps {
  unit: Unit;
}

export default function UnitCard({ unit }: UnitCardProps) {
  const statusColors = {
    'behind-schedule': 'bg-danger text-danger-foreground',
    'in-progress': 'bg-warning text-warning-foreground', 
    'completed': 'bg-success text-success-foreground'
  };

  const statusIcons = {
    'behind-schedule': AlertTriangle,
    'in-progress': Clock,
    'completed': CheckCircle
  };

  const getInfrastructureIcon = (subType: string) => {
    switch (subType) {
      case 'Gym & Facility Office': return Dumbbell;
      case 'Swimming Pool': return Waves;
      case 'Mosque': return Church;
      case 'Gate House': return Shield;
      case 'Road & Landscaping': return TreePine;
      case 'Commercial Building': return Building;
      case 'Mini Golf Course': return MapPin;
      default: return Building2;
    }
  };

  const getUnitIcon = () => {
    if (unit.type === 'Infrastructure') {
      return getInfrastructureIcon(unit.subType || '');
    }
    if (unit.type === 'Luxury Villa') {
      return Crown;
    }
    return Building2;
  };

  const StatusIcon = statusIcons[unit.status];
  const UnitIcon = getUnitIcon();

  const getActivityStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'text-success', icon: CheckCircle };
      case 'in-progress':
        return { color: 'text-warning', icon: Clock };
      case 'behind-schedule':
        return { color: 'text-danger', icon: AlertTriangle };
      default:
        return { color: 'text-muted-foreground', icon: Clock };
    }
  };

  return (
    <Card className="border-0 shadow-card hover:shadow-elevation transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <UnitIcon className="h-5 w-5 text-primary" />
            {unit.type === 'Infrastructure' ? unit.subType : unit.unitNumber}
          </CardTitle>
          <Badge className={`${statusColors[unit.status]} border-0`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {unit.status.replace('-', ' ')}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {unit.type !== 'Infrastructure' && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {unit.bedrooms} BR {unit.type}
            </span>
          )}
          {unit.type === 'Infrastructure' && (
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              Infrastructure
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {unit.targetCompletion}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold text-primary">{unit.progress}%</span>
          </div>
          <Progress value={unit.progress} className="h-2" />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Construction Activities</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(unit.activities).map(([activity, status]) => {
              const activityStatus = getActivityStatus(status);
              const ActivityIcon = activityStatus.icon;
              return (
                <div key={activity} className="flex items-center gap-2">
                  <ActivityIcon className={`h-3 w-3 ${activityStatus.color}`} />
                  <span className="capitalize">{activity}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground">Current Phase:</span>
          <p className="text-sm font-medium">{unit.currentPhase}</p>
        </div>

        {unit.challenges.length > 0 && (
          <div className="bg-danger/5 border border-danger/20 rounded-lg p-3">
            <h4 className="text-sm font-medium text-danger mb-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Challenges
            </h4>
            <ul className="text-xs space-y-1">
              {unit.challenges.map((challenge, index) => (
                <li key={index} className="text-muted-foreground">• {challenge}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Last updated: {unit.lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
}