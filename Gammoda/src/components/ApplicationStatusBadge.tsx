import { Badge } from "./ui/badge";
import { ApplicationStatus } from "../types";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export default function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const statusConfig: Record<ApplicationStatus, { label: string; variant: any }> = {
    applied: { label: "Applied", variant: "secondary" },
    under_review: { label: "Under Review", variant: "default" },
    shortlisted: { label: "Shortlisted", variant: "default" },
    interview: { label: "Interview", variant: "default" },
    offer: { label: "Offer", variant: "default" },
    hired: { label: "Hired", variant: "default" },
    rejected: { label: "Rejected", variant: "destructive" },
  };

  const config = statusConfig[status] || statusConfig.applied;

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
