"use client";

import { use } from "react";
import TripLayout from "@/components/layout/TripLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, TrendingUp, TrendingDown, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AddExpenseModal } from "@/components/trip/AddExpenseModal";

// Mock budget data
const mockBudget = {
  total: 5000,
  spent: 2340,
  categories: [
    { name: "Flights", amount: 1200, color: "bg-blue-500" },
    { name: "Hotels", amount: 800, color: "bg-purple-500" },
    { name: "Food", amount: 240, color: "bg-orange-500" },
    { name: "Activities", amount: 100, color: "bg-emerald-500" },
  ],
  recentExpenses: [
    { id: "1", title: "Flight to Tokyo", amount: 1200, paidBy: "Alex", category: "Flights" },
    { id: "2", title: "Park Hyatt Tokyo", amount: 800, paidBy: "Sarah", category: "Hotels" },
    { id: "3", title: "Sushi Lunch", amount: 120, paidBy: "Alex", category: "Food" },
    { id: "4", title: "Temple Entrance", amount: 20, paidBy: "Mike", category: "Activities" },
  ],
};

export default function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const percentSpent = (mockBudget.spent / mockBudget.total) * 100;
  const remaining = mockBudget.total - mockBudget.spent;

  return (
    <TripLayout tripId={id}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Budget</h2>
            <p className="text-muted-foreground">Track expenses and split costs</p>
          </div>
          <AddExpenseModal>
            <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </AddExpenseModal>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Total Budget</span>
              </div>
              <p className="text-3xl font-bold">€{mockBudget.total.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-sm text-muted-foreground">Spent</span>
              </div>
              <p className="text-3xl font-bold">€{mockBudget.spent.toLocaleString()}</p>
              <Progress value={percentSpent} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-sm text-muted-foreground">Remaining</span>
              </div>
              <p className="text-3xl font-bold text-emerald-500">€{remaining.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">By Category</h3>
            <div className="space-y-4">
              {mockBudget.categories.map((category) => {
                const percent = (category.amount / mockBudget.spent) * 100;
                return (
                  <div key={category.name} className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${category.color}`} />
                    <span className="flex-1 text-sm">{category.name}</span>
                    <span className="text-sm font-medium">€{category.amount}</span>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Recent Expenses</h3>
            <div className="space-y-3">
              {mockBudget.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{expense.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Paid by {expense.paidBy} • {expense.category}
                    </p>
                  </div>
                  <span className="font-semibold">€{expense.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TripLayout>
  );
}
