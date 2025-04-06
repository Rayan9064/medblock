"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { grantAccess, revokeAccess, checkAccess } from '@/services/accessControl';
import { toast } from '../../hooks/use-toast';

// Define types
interface AuthorizedDoctor {
  address: string;
  name?: string;
  accessGrantedAt?: Date;
}

interface AccessControlProps {
  reportId: string;
  reportName: string;
}

export default function DoctorAccess({ reportId, reportName }: AccessControlProps) {
  const { publicKey } = useWallet();
  const [doctorAddress, setDoctorAddress] = useState<string>('');
  const [doctorName, setDoctorName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authorizedDoctors, setAuthorizedDoctors] = useState<AuthorizedDoctor[]>([]);

  // Fetch currently authorized doctors for this report
  useEffect(() => {
    // In a real implementation, you would fetch the list of doctors 
    // who have access to this report
    // This would be implemented in the accessControl service
    // For now, we'll use mock data
    setAuthorizedDoctors([
      // Sample data - replace with actual API call
      // { address: "ABCDEFGxyz123456", name: "Dr. Smith", accessGrantedAt: new Date() }
    ]);
  }, [reportId]);

  const handleGrantAccess = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to grant access",
        variant: "destructive"
      });
      return;
    }

    if (!doctorAddress) {
      toast({
        title: "Doctor address required",
        description: "Please enter a doctor's wallet address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await grantAccess(
        reportId,
        publicKey.toString(),
        doctorAddress
      );

      if (success) {
        // Add doctor to the local state
        setAuthorizedDoctors([
          ...authorizedDoctors,
          { 
            address: doctorAddress, 
            name: doctorName || undefined, 
            accessGrantedAt: new Date() 
          }
        ]);
        
        toast({
          title: "Access granted",
          description: `Dr. ${doctorName || 'Unknown'} can now access this medical record`,
          variant: "default"
        });
        
        // Clear the input fields
        setDoctorAddress('');
        setDoctorName('');
      } else {
        toast({
          title: "Error granting access",
          description: "There was an error sharing your medical record",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error granting access:", error);
      toast({
        title: "Error granting access",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = async (doctorAddress: string) => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to revoke access",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await revokeAccess(
        reportId,
        publicKey.toString(),
        doctorAddress
      );

      if (success) {
        // Remove doctor from the local state
        setAuthorizedDoctors(
          authorizedDoctors.filter(doctor => doctor.address !== doctorAddress)
        );
        
        toast({
          title: "Access revoked",
          description: "The doctor no longer has access to this medical record",
          variant: "default"
        });
      } else {
        toast({
          title: "Error revoking access",
          description: "There was an error revoking access to your medical record",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error revoking access:", error);
      toast({
        title: "Error revoking access",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Doctor Access</CardTitle>
        <CardDescription>
          Grant or revoke access to your medical record: {reportName}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="doctorAddress" className="text-sm font-medium">
                Doctor&apos;s Wallet Address
              </label>
              <Input
                id="doctorAddress"
                placeholder="Enter doctor's wallet address"
                value={doctorAddress}
                onChange={(e) => setDoctorAddress(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="doctorName" className="text-sm font-medium">
                Doctor&apos;s Name (Optional)
              </label>
              <Input
                id="doctorName"
                placeholder="Enter doctor's name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button 
            onClick={handleGrantAccess} 
            disabled={isLoading || !doctorAddress || !publicKey}
            className="w-full"
          >
            {isLoading ? "Granting Access..." : "Grant Access"}
          </Button>
        </div>

        {authorizedDoctors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium">Authorized Doctors</h3>
            <div className="mt-2 space-y-2">
              {authorizedDoctors.map((doctor) => (
                <div 
                  key={doctor.address} 
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{doctor.name || "Unnamed Doctor"}</p>
                    <p className="text-sm text-gray-500">{doctor.address}</p>
                    {doctor.accessGrantedAt && (
                      <p className="text-xs text-gray-400">
                        Access granted: {doctor.accessGrantedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleRevokeAccess(doctor.address)} 
                    variant="destructive" 
                    size="sm"
                    disabled={isLoading}
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}