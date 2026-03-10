import { getTripBudget } from "@/actions/budget";
import { getTripMembers } from "@/actions/invite";
import { Event } from "@prisma/client";
import { StickerAnimator } from "@/components/ui/StickerAnimator";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";
import { AddExpenseModal } from "@/components/trip/AddExpenseModal";
import { TripDocumentCard, DocumentBadge } from "@/components/trip/TripDocumentCard";
import { StickerSurface } from "@/components/ui/StickerSurface";
import { SubSectionTitle } from "@/components/ui/SubSectionTitle";

const categoryColors: Record<string, string> = {
  accommodation: "bg-violet",
  transport: "bg-teal",
  food: "bg-orange-500",
  activity: "bg-accent",
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

  const categories = Object.entries(byCategory).map(([name, amount]) => ({
    name,
    amount,
    color: categoryColors[name] || categoryColors.other
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-5 md:space-y-6 max-w-4xl mx-auto pb-24 sm:pb-12 min-w-0 w-full">
      {/* Budget Document Card — wraps the whole section */}
      <TripDocumentCard
        perforation
        title="Budget"
        subtitle="Track expenses and split costs"
        badge={<DocumentBadge color="green">💰 Finances</DocumentBadge>}
        actions={
          <AddExpenseModal tripId={id} members={members}>
            <Button variant="stickerGreen" className="w-full md:w-auto gap-2">
              <Plus className="h-5 w-5" strokeWidth={3} />
              Add Expense
            </Button>
          </AddExpenseModal>
        }
      >
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <StickerAnimator delay={0}>
            <StickerSurface stickerColor="yellow" hoverStrong className="bg-sticker-yellow/80 overflow-hidden p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-9 w-9 rounded-xl bg-background border-2 border-border shadow-sticker-sm-soft flex items-center justify-center`}>
                  <Wallet className="h-4 w-4 md:h-5 md:w-5 text-foreground" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-foreground/80 leading-tight">Total<br />Budget</span>
              </div>
              <p className="text-xl md:text-2xl font-black">{currency} {limit.toLocaleString()}</p>
            </StickerSurface>
          </StickerAnimator>
          <StickerAnimator delay={0.07}>
            <StickerSurface stickerColor="pink" hoverStrong className="bg-sticker-pink/80 overflow-hidden p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-9 w-9 rounded-xl bg-background border-2 border-border shadow-sticker-sm-soft flex items-center justify-center`}>
                  <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-foreground" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-foreground/80 leading-tight">Total<br />Spent</span>
              </div>
              <p className="text-xl md:text-2xl font-black">{currency} {totalSpent.toLocaleString()}</p>
              <div className="mt-2 h-1.5 w-full bg-background border-2 border-border rounded-full overflow-hidden">
                <div className="h-full bg-foreground" style={{ width: `${percentSpent}%` }} />
              </div>
            </StickerSurface>
          </StickerAnimator>
          <StickerAnimator delay={0.14}>
            <StickerSurface stickerColor="green" hoverStrong className="bg-sticker-green/80 overflow-hidden p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-9 w-9 rounded-xl bg-background border-2 border-border shadow-sticker-sm-soft flex items-center justify-center`}>
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-foreground" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-foreground/80 leading-tight">Total<br />Remaining</span>
              </div>
              <p className={`text-xl md:text-2xl font-black ${remaining < 0 ? "text-sticker-coral" : "text-foreground"}`}>
                {currency} {remaining.toLocaleString()}
              </p>
            </StickerSurface>
          </StickerAnimator>
        </div>

        {/* Categories — sub-section */}
        <div className="border-2 border-border rounded-xl bg-background/50 p-4 mb-4">
          <SubSectionTitle>By Category</SubSectionTitle>
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => {
                const percent = (category.amount / totalSpent) * 100;
                return (
                  <div key={category.name} className="flex items-center gap-2 p-2 rounded-xl border-2 border-transparent hover:border-border hover:bg-secondary/20 transition-all">
                    <div className={`h-3 w-3 rounded-full border-2 border-border ${category.color}`} />
                    <span className="flex-1 text-xs font-bold capitalize">{category.name}</span>
                    <span className="text-xs font-black">{currency} {category.amount}</span>
                    <span className="text-[10px] font-bold text-muted-foreground w-8 text-right">
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground font-bold text-xs">No expenses yet.</p>
          )}
        </div>

        {/* Recent Expenses — sub-section */}
        <div className="border-2 border-border rounded-xl bg-background/50 p-4">
          <SubSectionTitle>Recent Expenses</SubSectionTitle>
          {expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.map((expense: Event) => {
                const payer = members.find(m => m.user.id === expense.paidBy)?.user.name || "Unknown";
                return (
                  <div key={expense.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border-2 border-transparent hover:border-border transition-all cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs leading-tight truncate mb-0.5">{expense.title}</p>
                      <p className="text-[11px] font-bold text-muted-foreground truncate capitalize">
                        Paid by {payer} • {expense.category}
                      </p>
                    </div>
                    <span className="font-black text-sm shrink-0">{currency} {expense.cost}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground font-bold text-xs">No recent expenses.</p>
          )}
        </div>
      </TripDocumentCard>
    </div>
  );
}
