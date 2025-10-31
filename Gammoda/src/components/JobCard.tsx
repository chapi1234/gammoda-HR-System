import { Link } from "react-router-dom";
import { MapPin, Briefcase, DollarSign, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Job } from "../types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const postedDate = new Date(job.postedDate);
  const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-gray-900">
              <Link to={`/careers/${job.id}`} className="hover:text-blue-600">
                {job.title}
              </Link>
            </h3>
            <div className="flex flex-wrap gap-2 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{job.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
          <Badge variant={job.status === "active" ? "default" : "secondary"}>
            {job.status}
          </Badge>
        </div>

        <p className="mb-4 text-gray-600 text-sm line-clamp-2">{job.description}</p>

        <div className="mb-4 flex flex-wrap gap-3 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{job.jobType}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{job.salaryRange}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Posted {daysAgo === 0 ? "today" : `${daysAgo} days ago`}</span>
          </div>
          {job.applicationsCount !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{job.applicationsCount} applicants</span>
            </div>
          )}
        </div>

        <Link to={`/careers/${job.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
