import { getTripBudget } from "@/actions/budget";
import { getTripMembers } from "@/actions/invite";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, DollarSign, PieChart, TrendingUp, TrendingDown, Wallet, Plus, Download, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AddExpenseModal } from "@/components/trip/AddExpenseModal";
import { format } from "date-fns";

const categoryColors: Record<string, string> = {
  accommodation: "bg-purple-500",
  transport: "bg-blue-500",
  food: "bg-orange-500",
  activity: "bg-emerald-500",
  shopping: "bg-pink-500",
  other: "bg-gray-500",
};

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [budgetData, members] = await Promise.all([
    getTripBudget(id),
    getTripMembers(id)
  ]);

  const { expenses, totalSpent, byCategory, limit, currency } = budgetData;
  const remaining = limit - totalSpent;
  const percentSpent = limit > 0 ? (totalSpent / limit) * 100 : 0;

  // Transform categories for display
  const categories = Object.entries(byCategory).map(([name, amount]) => ({
    name,
    amount,
    color: categoryColors[name] || categoryColors.other
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Budget</h2>
          <p className="text-sm md:text-base text-muted-foreground">Track expenses and split costs</p>
        </div>
        <AddExpenseModal tripId={id} members={members}>
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
            <p className="text-xl md:text-3xl font-bold">{currency} {limit.toLocaleString()}</p>
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
            <p className="text-xl md:text-3xl font-bold">{currency} {totalSpent.toLocaleString()}</p>
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
            <p className={`text-xl md:text-3xl font-bold ${remaining < 0 ? "text-red-500" : "text-emerald-500"}`}>
              {currency} {remaining.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card className="border-border/40 bg-card/50">
        <CardContent className="p-4 md:p-6">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">By Category</h3>
          {categories.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {categories.map((category) => {
                const percent = (category.amount / totalSpent) * 100;
                return (
                  <div key={category.name} className="flex items-center gap-3 md:gap-4">
                    <div className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full ${category.color}`} />
                    <span className="flex-1 text-xs md:text-sm capitalize">{category.name}</span>
                    <span className="text-xs md:text-sm font-medium">{currency} {category.amount}</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground w-8 md:w-12 text-right">
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No expenses yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card className="border-border/40 bg-card/50">
        <CardContent className="p-4 md:p-6">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Recent Expenses</h3>
          {expenses.length > 0 ? (
            <div className="space-y-2 md:space-y-3">
              {expenses.map((expense: any) => {
                const payer = members.find(m => m.user.id === expense.paidBy)?.user.name || "Unknown";
                return (
                  <div key={expense.id} className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs md:text-sm truncate">{expense.title}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground truncate capitalize">
                        Paid by {payer} • {expense.category}
                      </p>
                    </div>
                    <span className="font-semibold text-sm md:text-base">{currency} {expense.cost}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recent expenses.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
