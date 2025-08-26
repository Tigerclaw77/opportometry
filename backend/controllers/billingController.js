const Job = require("../models/Job");
const User = require("../models/User");

// Prices
const FIRST_MONTH_PRICE = 50;
const RECURRING_PRICE = 25;

// ✅ Monthly billing engine
const billJobsMonthly = async (req, res) => {
  try {
    const today = new Date();

    const jobsToBill = await Job.find({
      status: "open",
      "billing.billingStatus": "active",
    });

    let totalBilled = 0;
    let totalJobs = 0;
    let charges = [];

    for (const job of jobsToBill) {
      const last = job.billing.lastBilled;
      const nextDue = new Date(last);
      nextDue.setMonth(nextDue.getMonth() + 1);

      if (today >= nextDue) {
        const isFirstMonth = job.billing.monthsBilled === 0;
        const price = isFirstMonth ? FIRST_MONTH_PRICE : RECURRING_PRICE;

        // Simulated charge (replace with Stripe or real logic later)
        charges.push({
          jobId: job._id,
          userId: job.createdBy,
          amount: price,
        });

        job.billing.monthsBilled += 1;
        job.billing.totalPaid += price;
        job.billing.lastBilled = today;
        await job.save();

        totalBilled += price;
        totalJobs += 1;
      }
    }

    res.status(200).json({
      message: "Monthly billing processed.",
      totalJobsBilled: totalJobs,
      totalAmount: totalBilled,
      charges,
    });
  } catch (error) {
    console.error("❌ Billing error:", error.message);
    res.status(500).json({ message: "Billing failed", error: error.message });
  }
};

module.exports = { billJobsMonthly };
