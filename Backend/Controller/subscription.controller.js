const Expense = require("../Models/Expense");
const Subscription = require("../Models/Subscription");

/* ===============================
   NEXT RENEWAL CALCULATOR
================================ */
function calculateNextRenewal(startDate, frequency) {
  const date = new Date(startDate);

  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid subscription frequency");
  }

  return date;
}

/* ===============================
   CREATE SUBSCRIPTION
================================ */
exports.createSubscription = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      name,
      amount,
      category,
      frequency,
      startDate,
      notes,
      reminderDays,
    } = req.body;

    /* -------- Validation -------- */
    if (!name || !amount || !frequency || !startDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const allowedFrequencies = [
      "daily",
      "weekly",
      "monthly",
      "quarterly",
      "yearly",
    ];

    if (!allowedFrequencies.includes(frequency)) {
      return res.status(400).json({
        message: "Invalid frequency value",
      });
    }

    /* -------- Duplicate Check -------- */
    const existingSubscription = await Subscription.findOne({
      userId,
      name: name.trim(),
    });

    if (existingSubscription) {
      return res.status(409).json({
        message: "Subscription with this name already exists",
      });
    }

    /* -------- Create Subscription -------- */
    const nextRenewalDate = calculateNextRenewal(startDate, frequency);

    const newSubscription = new Subscription({
      userId,
      name: name.trim(),
      amount: Number(amount),
      category: category || "Subscriptions",
      frequency,
      startDate: new Date(startDate),
      nextRenewalDate,
      notes: notes || "",
      reminderDays: reminderDays || 3,
      status: "active",
      autoRenew: true,
      lastProcessedDate: new Date(startDate),
    });

    await newSubscription.save();

    /* -------- Create Initial Expense -------- */
    const newExpense = new Expense({
      userId,
      type: "expense",
      category: category || "Subscriptions",
      amount: Number(amount),
      date: new Date(startDate),
      note: `Subscription (${frequency}) - Auto generated`,
    });

    await newExpense.save();

    /* -------- Response -------- */
    res.status(201).json({
      message: "Subscription created and first expense recorded",
      subscription: newSubscription,
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      message: "Failed to create subscription",
    });
  }
};

//get all subscription
exports.getSubscriptions = async (req, res) => {
  try {
    const userId = req.userId;

    const subscriptions = await Subscription.find({ userId }).sort({
      nextRenewalDate: 1,
    });

    // Calculate summary
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === "active"
    );
    const monthlyTotal = activeSubscriptions
      .filter((s) => s.frequency === "monthly")
      .reduce((sum, s) => sum + s.amount, 0);

    const yearlyTotal = activeSubscriptions.reduce((sum, s) => {
      switch (s.frequency) {
        case "daily":
          return sum + s.amount * 365;
        case "weekly":
          return sum + s.amount * 52;
        case "monthly":
          return sum + s.amount * 12;
        case "quarterly":
          return sum + s.amount * 4;
        case "yearly":
          return sum + s.amount;
        default:
          return sum;
      }
    }, 0);

    res.json({
      subscriptions,
      summary: {
        total: subscriptions.length,
        active: activeSubscriptions.length,
        monthlyTotal,
        yearlyTotal,
        averageCost:
          activeSubscriptions.length > 0
            ? Math.round(monthlyTotal / activeSubscriptions.length)
            : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};

// toggle subscription status
exports.toggleSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status } = req.body;

    const subscription = await Subscription.findOneAndUpdate(
      { _id: id, userId },
      { status },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(subscription);
  } catch (error) {
    console.error("Error toggling subscription:", error);
    res.status(500).json({ message: "Failed to toggle subscription" });
  }
};
