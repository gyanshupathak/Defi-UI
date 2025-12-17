# How to View Custom Events in Google Analytics 4

## 🎯 Quick Access to Events

### Method 1: Events Report (Recommended)

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Click "Reports"** in the left sidebar
3. **Click "Engagement"** → **"Events"**
4. You'll see all your custom events listed!

### Method 2: Realtime Events

1. **Go to Google Analytics**: https://analytics.google.com/
2. **Click "Reports"** → **"Realtime"**
3. **Scroll down** to the "Event count by Event name" section
4. You'll see events as they happen in real-time!

---

## 📊 What You'll See

### Events Report View

You'll see a table with:
- **Event name**: The action (e.g., `button_clicked`, `tab_switched`)
- **Event count**: How many times it happened
- **Total users**: How many users triggered it
- **Total revenue**: (if applicable)

### Event Details

Click on any event name to see:
- **Event parameters**: All the data sent with the event
- **Event count over time**: Chart showing when events occurred
- **Top pages**: Which pages the event happened on

---

## 🔍 Finding Your Specific Events

### Your Custom Events:

1. **`button_clicked`** - When users click buttons
   - Parameters: `button_name`, `location`

2. **`tab_switched`** - When users switch tabs
   - Parameters: `tab_name`

3. **`strategy_card_clicked`** - When users click strategy cards
   - Parameters: `strategy_name`

4. **`deposit_initiated`** - When users start a deposit
   - Parameters: `strategy_name`, `amount`

5. **`wallet_connected`** - When users connect wallet
   - Parameters: `wallet_address`, `chain_id`

---

## 🧪 Testing Events in Real-Time

### Step-by-Step:

1. **Open GA4 Realtime Report**
   - Reports → Realtime

2. **Open your app** in another tab
   - http://localhost:3000

3. **Perform actions**:
   - Click a strategy card → Should see `strategy_card_clicked`
   - Click deposit button → Should see `button_clicked` + `deposit_initiated`
   - Switch tabs → Should see `tab_switched`
   - Connect wallet → Should see `wallet_connected`

4. **Check Realtime Events**
   - Events should appear within 10-30 seconds
   - Look for "Event count by Event name" section

---

## 📈 Viewing Event Parameters

### To See Event Details:

1. **Go to Events Report**
   - Reports → Engagement → Events

2. **Click on an event name** (e.g., `button_clicked`)

3. **Scroll down** to see:
   - **Event parameters** table
   - Shows all custom data (button_name, location, etc.)

4. **Click on a parameter** to see:
   - All values for that parameter
   - Count of each value

### Example: Viewing Button Clicks

1. Go to Events → Click `button_clicked`
2. Scroll to "Event parameters"
3. Click `button_name` parameter
4. See all buttons clicked: "deposit", "withdraw", etc.

---

## 🔍 Creating Custom Reports

### Create a Custom Event Report:

1. **Go to Explore** (left sidebar)
2. **Click "Blank"** or use a template
3. **Add dimensions**:
   - Event name
   - Page title
   - Custom parameters (button_name, strategy_name, etc.)
4. **Add metrics**:
   - Event count
   - Total users
5. **Save** your report

---

## 🐛 Troubleshooting: Not Seeing Events?

### Check These:

1. **Wait 24-48 hours** for standard reports (Realtime shows immediately)

2. **Check Realtime first**:
   - Reports → Realtime → Events
   - Should see events within 30 seconds

3. **Verify events are being sent**:
   - Open browser DevTools (F12)
   - Network tab → Filter "collect"
   - Perform action → Should see POST request to google-analytics.com
   - Check request payload for your event data

4. **Check event names**:
   - Make sure they match exactly (case-sensitive)
   - `button_clicked` not `ButtonClicked`

5. **Verify Measurement ID**:
   - Check `.env.local` has correct ID
   - Restart dev server after changes

---

## 📱 Mobile App View

### View Events on Mobile:

1. **Open GA4 mobile app**
2. **Tap "Reports"**
3. **Tap "Events"**
4. Same data, mobile-friendly view!

---

## 🎯 Quick Reference

| What You Want to See | Where to Go |
|---------------------|-------------|
| **All events** | Reports → Engagement → Events |
| **Live events** | Reports → Realtime → Events |
| **Event details** | Click event name in Events report |
| **Event parameters** | Event details → Event parameters section |
| **Custom reports** | Explore → Create new report |

---

## 💡 Pro Tips

1. **Use Realtime for Testing**: See events immediately
2. **Use Events Report for Analysis**: See historical data
3. **Create Custom Reports**: For specific insights
4. **Set Up Conversions**: Mark important events as conversions
5. **Use DebugView**: For detailed event debugging (requires GA Debugger extension)

---

## 🔗 Useful Links

- [GA4 Events Documentation](https://support.google.com/analytics/answer/9267735)
- [GA4 Realtime Reports](https://support.google.com/analytics/answer/9271392)
- [GA4 Custom Reports](https://support.google.com/analytics/answer/9303316)

