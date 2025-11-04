import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Donor } from "@shared/schema";
import { CheckCircle, XCircle, Clock, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface AdminDashboardProps {
  onUnauthorized: () => void;
}

export default function AdminDashboard({ onUnauthorized }: AdminDashboardProps) {
  const { toast } = useToast();

  const { data: donors, isLoading, error } = useQuery<Donor[]>({
    queryKey: ["/api/donors"],
    retry: false,
  });

  // Handle authentication errors using effect to avoid render-phase navigation
  useEffect(() => {
    if (error) {
      const err = error as any;
      if (err.message?.startsWith("401")) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        onUnauthorized();
      }
    }
  }, [error, toast, onUnauthorized]);

  const approveMutation = useMutation({
    mutationFn: async (donorId: string) => {
      return await apiRequest("POST", `/api/donors/${donorId}/approve`, {});
    },
    onSuccess: (_, donorId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/donors"] });
      toast({
        title: "Donor approved",
        description: "Email notification has been sent to the donor.",
      });
    },
    onError: (error: any) => {
      if (error.message?.startsWith("401")) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        onUnauthorized();
      } else {
        toast({
          title: "Error",
          description: "Failed to approve donor.",
          variant: "destructive",
        });
      }
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (donorId: string) => {
      return await apiRequest("POST", `/api/donors/${donorId}/reject`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donors"] });
      toast({
        title: "Donor rejected",
        description: "The application has been rejected.",
      });
    },
    onError: (error: any) => {
      if (error.message?.startsWith("401")) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        onUnauthorized();
      } else {
        toast({
          title: "Error",
          description: "Failed to reject donor.",
          variant: "destructive",
        });
      }
    },
  });

  const pendingDonors = donors?.filter((d) => d.status === "pending") || [];
  const approvedDonors = donors?.filter((d) => d.status === "approved") || [];
  const rejectedDonors = donors?.filter((d) => d.status === "rejected") || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading donors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-dashboard-title">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage donor applications and view donation statistics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Applications</div>
            <div className="text-3xl font-bold" data-testid="stat-total">
              {donors?.length || 0}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400" data-testid="stat-pending">
              {pendingDonors.length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="stat-approved">
              {approvedDonors.length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400" data-testid="stat-rejected">
              {rejectedDonors.length}
            </div>
          </Card>
        </div>

        {/* Pending Applications */}
        {pendingDonors.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Pending Applications</h2>
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDonors.map((donor) => (
                    <TableRow key={donor.id} data-testid={`row-donor-${donor.id}`}>
                      <TableCell className="font-medium">{donor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{donor.bloodType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <Mail className="h-3 w-3" />
                            {donor.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {donor.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{donor.age}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(donor.appliedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{getStatusBadge(donor.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => approveMutation.mutate(donor.id)}
                            disabled={approveMutation.isPending}
                            data-testid={`button-approve-${donor.id}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectMutation.mutate(donor.id)}
                            disabled={rejectMutation.isPending}
                            data-testid={`button-reject-${donor.id}`}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {pendingDonors.map((donor) => (
                <Card key={donor.id} className="p-4" data-testid={`card-donor-${donor.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{donor.name}</h3>
                      <Badge variant="outline" className="mt-1">{donor.bloodType}</Badge>
                    </div>
                    {getStatusBadge(donor.status)}
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {donor.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {donor.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {donor.address}
                    </div>
                    <div className="text-muted-foreground">
                      Age: {donor.age} • Applied: {format(new Date(donor.appliedAt), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1"
                      onClick={() => approveMutation.mutate(donor.id)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-approve-mobile-${donor.id}`}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => rejectMutation.mutate(donor.id)}
                      disabled={rejectMutation.isPending}
                      data-testid={`button-reject-mobile-${donor.id}`}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* All Donors */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">All Applications</h2>
          {donors && donors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No donor applications yet.
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donors?.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell className="font-medium">{donor.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{donor.bloodType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{donor.email}</TableCell>
                        <TableCell className="text-sm">{donor.phone}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(donor.appliedAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{getStatusBadge(donor.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {donors?.map((donor) => (
                  <Card key={donor.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{donor.name}</h3>
                        <Badge variant="outline" className="mt-1">{donor.bloodType}</Badge>
                      </div>
                      {getStatusBadge(donor.status)}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>{donor.email}</div>
                      <div>{donor.phone}</div>
                      <div>Applied: {format(new Date(donor.appliedAt), "MMM d, yyyy")}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
