"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Euro } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

import { createExpense } from "@/actions/budget";
import { expenseSchema, ExpenseFormValues } from "@/lib/validations/budget";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddExpenseModalProps {
  children?: React.ReactNode;
  tripId: string;
  members: any[]; // refined type would be better but any for now to match Prisma result structure
}

export function AddExpenseModal({ children, tripId, members }: AddExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      amount: "",
      currency: "EUR",
      category: "food",
      paidBy: "me",
      splitType: "equal",
    },
  });

  async function onSubmit(data: ExpenseFormValues) {
    setIsLoading(true);
    try {
      const result = await createExpense(tripId, data);
      if (result.success) {
        toast.success("Expense added successfully");
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add expense");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4 md:px-0">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dinner at Mario's" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Euro className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="0.00" type="number" step="0.01" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="food">Food & Drink</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paidBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paid By</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Payer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="me">Me</SelectItem>
                    {members.filter(m => m.user.id /* Assuming we filter out current user if we want 'me' to be distinct, or just list everyone */).map((member: any) => (
                      <SelectItem key={member.user.id} value={member.user.id}>{member.user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="splitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Split</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Split" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="equal">Equally</SelectItem>
                    <SelectItem value="you">Just For You</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex gap-3 justify-end">
          {!isDesktop && (
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">Cancel</Button>
            </DrawerClose>
          )}
          {isDesktop && (
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className={cn("bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md", !isDesktop && "flex-1")}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Expense
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || <Button>Add Expense</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Track your spending and split costs with the group.
            </DialogDescription>
          </DialogHeader>
          {FormContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || <Button>Add Expense</Button>}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Expense</DrawerTitle>
          <DrawerDescription>
            Track your spending and split costs with the group.
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-8 max-h-[70vh] overflow-y-auto">
          {FormContent}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
