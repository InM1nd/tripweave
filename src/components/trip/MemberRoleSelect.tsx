"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import { updateMemberRole } from "@/actions/member"; // Adjust path if needed
import { toast } from "sonner";
import { useState } from "react";
import { Shield, Crown, User } from "lucide-react";

interface MemberRoleSelectProps {
    tripId: string;
    memberId: string;
    currentRole: Role;
    disabled?: boolean;
}

export function MemberRoleSelect({
    tripId,
    memberId,
    currentRole,
    disabled = false
}: MemberRoleSelectProps) {
    const [role, setRole] = useState<Role>(currentRole);
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = async (newRole: Role) => {
        setIsLoading(true);
        // Optimistic update
        setRole(newRole);

        try {
            const result = await updateMemberRole(tripId, memberId, newRole);

            if (!result.success) {

                // Revert on failure
                setRole(currentRole);
                toast.error(result.error || "Failed to update role");
            } else {
                toast.success(`Role updated to ${newRole}`);
            }
        } catch (error) {
            setRole(currentRole);
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (disabled) {
        return null; // Or just text/badge if not editable
    }

    return (
        <Select
            value={role}
            onValueChange={(val) => handleRoleChange(val as Role)}
            disabled={disabled || isLoading}
        >
            <SelectTrigger className="h-7 text-xs w-[110px] bg-background/50 border-border/50">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="OWNER" disabled>
                    <div className="flex items-center gap-2">
                        <Crown className="w-3 h-3 text-amber-500" />
                        <span>Owner</span>
                    </div>
                </SelectItem>
                <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-blue-500" />
                        <span>Admin</span>
                    </div>
                </SelectItem>
                <SelectItem value="MEMBER">
                    <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span>Member</span>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
