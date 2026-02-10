"use client";

import { use } from "react";
import TripLayout from "@/components/layout/TripLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, DollarSign, PieChart, TrendingUp, TrendingDown, Wallet, Plus, Download, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AddExpenseModal } from "@/components/trip/AddExpenseModal";

// Mock budget data
const budget = {
  total: 0,
  spent: 0,
  categories: [],
  recentExpenses: [],
};

export default function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const percentSpent = (budget.spent / (budget.total || 1)) * 100;
  const remaining = budget.total - budget.spent;

  return (
    <TripLayout tripId={id}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Budget</h2>
            <p className="text-sm md:text-base text-muted-foreground">Track expenses and split costs</p>
          </div>
          <AddExpenseModal>
            <Button className="w-full md:w-auto gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </AddExpenseModal>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2 md:mb-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">Total Budget</span>
              </div>
              <p className="text-xl md:text-3xl font-bold">€{budget.total.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2 md:mb-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">Spent</span>
              </div>
              <p className="text-xl md:text-3xl font-bold">€{budget.spent.toLocaleString()}</p>
              <Progress value={percentSpent} className="mt-2 h-1.5 md:h-2" />
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2 md:mb-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">Remaining</span>
              </div>
              <p className="text-xl md:text-3xl font-bold text-emerald-500">€{remaining.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-4 md:p-6">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">By Category</h3>
            <div className="space-y-3 md:space-y-4">
              {budget.categories.map((category: any) => {
                const percent = (category.amount / budget.spent) * 100;
                return (
                  <div key={category.name} className="flex items-center gap-3 md:gap-4">
                    <div className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full ${category.color}`} />
                    <span className="flex-1 text-xs md:text-sm">{category.name}</span>
                    <span className="text-xs md:text-sm font-medium">€{category.amount}</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground w-8 md:w-12 text-right">
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
          <CardContent className="p-4 md:p-6">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Recent Expenses</h3>
            <div className="space-y-2 md:space-y-3">
              {budget.recentExpenses.map((expense: any) => (
                <div key={expense.id} className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs md:text-sm truncate">{expense.title}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                      Paid by {expense.paidBy} • {expense.category}
                    </p>
                  </div>
                  <span className="font-semibold text-sm md:text-base">€{expense.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TripLayout>
  );
}
