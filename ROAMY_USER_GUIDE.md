# 🏖️ Roamy - User Guide & UI Flow Documentation

## 🌟 Welcome to Roamy
Your all-in-one travel booking platform for seamless travel planning and booking experience.

---

## 📱 User Interface Flow

### 🏠 **Home Page - Your Travel Journey Starts Here**

#### What You'll See:
- **🔍 Search Bar**: Quick destination search at the top
- **🌍 Trending Destinations**: Beautiful cards showing popular destinations with:
  - High-quality destination images
  - Star ratings and review counts
  - Budget ranges (₹2,000-4,000/day)
  - Quick "Explore" buttons
- **⚡ Quick Actions**: Easy access to main features
- **📊 API Status**: Real-time backend connectivity check

#### What You Can Do:
- Search for any destination using the search bar
- Browse trending destinations by clicking on cards
- Navigate to login/register from the top navigation
- Access Travel Suggestions, Search, or Bookings from the menu

---

### 🔐 **Getting Started - Registration & Login**

#### 📝 **Registration Flow**
1. **Click "Register"** in the top navigation
2. **Fill Your Details**:
   - First Name & Last Name
   - Email address
   - Phone number  
   - Secure password
3. **Choose Travel Interests** (helps with personalized recommendations):
   - 🏖️ Beach & Coastal
   - 🏔️ Adventure & Outdoors
   - 🏛️ Culture & Heritage
   - 🍽️ Food & Cuisine
   - 🌃 Nightlife & Entertainment
   - 🧘 Wellness & Spa
   - ☀️ Luxury & Comfort
4. **Submit** → Automatic redirect to login

#### 🔑 **Login Process**
1. **Enter Credentials**: Email and password
2. **Secure Authentication**: JWT token stored securely
3. **Auto-Population**: Your profile data is remembered for future bookings
4. **Persistent Login**: Stay logged in across browser sessions

---

### 🌍 **Travel Planning - The Heart of Roamy**

#### 🎯 **Travel Suggestions Page**

##### **Step 1: Plan Your Journey**
Fill out the smart travel form:

**📍 Locations**
- **From**: Your departure city
- **To**: Your destination

**📅 Travel Dates**  
- **Start Date**: Trip beginning (defaults to 1 week from today)
- **End Date**: Trip ending (defaults to 2 weeks from today)

**💰 Budget Level**
- **Budget** (₹1,500-3,000/day): Hostels, local transport
- **Mid-Range** (₹3,000-7,000/day): 3-star hotels, mixed transport  
- **Luxury** (₹7,000+/day): 4-5 star hotels, premium transport

**🎯 Travel Interests** (Multi-select)
- Adventure, Beach, Culture, Food, Nightlife, Wellness, Luxury

##### **Step 2: Explore Your Options (4 Tabs)**

#### 🏨 **Hotels Tab**
**What You'll See**:
- Beautiful hotel cards with:
  - Hotel images and star ratings
  - Price per night in your selected currency
  - Location and amenities
  - "Book Now" buttons

**Booking Process**:
1. **Click "Book Now"** on any hotel
2. **Hotel Booking Modal Opens** with 3 steps:

**Step 1: Guest Details**
- Personal info (auto-filled from profile)
- Check-in/Check-out dates with calendar pickers
- Number of guests (adults & children)
- Room type selection:
  - **Standard Room** (base price)
  - **Deluxe Room** (+50% price)
  - **Suite** (+100% price)

**Step 2: Review Booking**  
- Complete booking summary
- Price breakdown: (Base Price × Room Multiplier × Nights)
- Special requests field
- **Confirm Booking** button

**Step 3: Confirmation**
- ✅ Booking confirmed with reference number
- 📧 Contact details for support
- 🔗 "View Bookings" to manage your reservation

#### 🚗 **Transport Tab**
**Available Transport Types**:
- ✈️ **Flights**: Airlines with timing and pricing
- 🚂 **Trains**: Railway options with classes
- 🚌 **Buses**: Intercity and local buses
- 🚖 **Taxis**: Local transportation
- 🚗 **Car Rentals**: Self-drive options
- ⛴️ **Ferry**: Water transport where available

**Transport Booking Process**:
1. **Select Transport** → Click "Book [Transport Type]"
2. **3-Step Booking Modal**:

**Step 1: Passenger Details**
- Contact information
- Number of passengers (adults & children)
- Seat preference:
  - **Economy** (base price)
  - **Business** (1.8x price)
  - **First Class** (2.5x price)
- Special requests (dietary, accessibility)

**Step 2: Review Transport Booking**
- Route details (departure → arrival)
- Timing and duration
- Price calculation: (Base Price × Seat Multiplier × Passengers)

**Step 3: Transport Confirmation**
- 🎫 E-ticket information
- 📱 Booking reference for travel
- 📞 Support contact details

#### 🎭 **Explore Tab**  
**Discover Attractions**:
- Curated attractions based on your selected interests
- Each attraction card shows:
  - 📸 Attraction images
  - ⭐ Ratings and reviews
  - 💰 Entry fees (if any)
  - 🕒 Operating hours
  - ♿ Accessibility information
  - 👶 Kid-friendly indicators

#### 📅 **Itinerary Tab**
**AI-Generated Travel Plan**:
- Day-by-day itinerary suggestions
- Recommended attractions with optimal timing
- Budget breakdown for activities
- Travel tips and local insights

---

### 📋 **Booking Management**

#### 🎛️ **My Bookings Dashboard**

**Smart Filtering System**:

**📊 Left Sidebar - Booking Type**
- **🏨 Hotels** (Shows count of hotel bookings)
- **🚗 Transport** (Shows count of transport bookings)

**🏷️ Top Tabs - Booking Status**  
- **All Bookings**: Complete booking history
- **Confirmed**: Active confirmed bookings
- **Pending**: Bookings awaiting confirmation  
- **Cancelled**: Cancelled bookings with reasons

**📱 Booking Cards Display**:
Each booking shows:
- **Booking Reference Number** (unique ID)
- **Type Badge**: Hotel or Transport with color coding
- **Status Badge**: Color-coded status (Green=Confirmed, Orange=Pending, Red=Cancelled)
- **Key Details**: Dates, locations, guest count
- **Total Amount**: In your selected currency
- **Action Buttons**: View details, Cancel booking

#### 🚫 **Cancellation Process**
1. **Click "Cancel"** on any booking card
2. **Confirmation Dialog** opens:
   - Booking details display
   - **Reason Selection** (required):
     - Change of plans
     - Found better option  
     - Emergency
     - Other (with text field)
3. **Confirm Cancellation** → Status immediately updates to "CANCELLED"

---

### 🔍 **Search & Discovery**

#### 🌟 **Search Results Page**
- **Grid View**: Destination cards with images and info
- **Sorting Options**: 
  - Popularity (most visited)
  - Alphabetical
  - Rating (highest first)
- **Filter Options**:
  - Budget level
  - Destination type  
  - Minimum rating
- **Quick Navigation**: Click any destination to view details

#### 🏛️ **Destination Details**
- **Comprehensive Information**: 
  - High-resolution images
  - Detailed descriptions
  - Best time to visit
  - Local attractions
  - Hotels and accommodations
  - Transport links

---

### 🎨 **User Experience Features**

#### 💱 **Currency Support**
**Available Currencies**:
- 🇺🇸 USD (US Dollar)
- 🇪🇺 EUR (Euro)  
- 🇬🇧 GBP (British Pound)
- 🇮🇳 INR (Indian Rupee)
- 🇨🇦 CAD (Canadian Dollar)
- 🇦🇺 AUD (Australian Dollar)

**How It Works**:
- Select currency from navbar dropdown
- All prices automatically convert
- Your preference is remembered
- Booking amounts displayed in selected currency

#### 📱 **Responsive Design**
- **Mobile-First**: Optimized for phones and tablets
- **Touch-Friendly**: Large buttons and easy navigation
- **Fast Loading**: Optimized images and minimal loading times
- **Cross-Browser**: Works on Chrome, Firefox, Safari, Edge

#### 🔔 **Smart Notifications**
- **Success Messages**: Green toasts for successful actions
- **Error Alerts**: Clear error messages with solutions
- **Validation Feedback**: Real-time form validation
- **Loading States**: Progress indicators during operations

---

### 🛡️ **Security & Privacy**

#### 🔒 **Data Protection**
- **Secure Authentication**: JWT tokens with expiration
- **Password Security**: Encrypted password storage
- **Session Management**: Automatic logout on inactivity
- **Privacy**: Personal data encryption

#### 🚫 **Access Control**
- **Public Pages**: Home, Search, Destination details
- **Protected Pages**: Require login
  - My Bookings
  - Travel Suggestions (booking features)
  - Profile management
- **Auto-Redirect**: Redirected to login if not authenticated

---

### ❗ **Error Handling & Support**

#### 🚨 **Common Issues & Solutions**

**🔑 Authentication Issues**
- **Problem**: "Please login to book"
- **Solution**: Click login, enter credentials
- **Auto-Fix**: Page redirects to login automatically

**📅 Date Validation**  
- **Problem**: "Check-out must be after check-in"
- **Solution**: Select valid date range in calendar
- **Helper**: System prevents past dates automatically

**🌐 Network Issues**
- **Problem**: "Failed to load data"  
- **Solution**: Check internet connection, refresh page
- **Retry**: Most actions have automatic retry capability

**💳 Booking Failures**
- **Problem**: "Booking failed"
- **Solution**: Verify all required fields are filled
- **Support**: Contact details provided in confirmation

#### 📞 **Getting Help**
- **In-App Support**: Error messages include helpful guidance
- **Booking Support**: Contact details in booking confirmations
- **Technical Issues**: Clear error messages with suggested actions

---

### 💡 **Tips for Best Experience**

#### 🎯 **Booking Tips**
1. **Complete Your Profile**: Faster booking with auto-filled details
2. **Save Preferences**: Select interests for better recommendations  
3. **Compare Options**: Use filters to find best deals
4. **Book Early**: Better availability and pricing
5. **Check Cancellation**: Review cancellation policies before booking

#### 🔄 **Navigation Tips**
1. **Use Breadcrumbs**: Easy navigation back to previous pages
2. **Keyboard Shortcuts**: Tab navigation through forms
3. **Mobile Gestures**: Swipe navigation on mobile devices
4. **Bookmark Favorites**: Save frequently used pages

#### ⚡ **Performance Tips**
1. **Stable Internet**: Ensure good connection for booking
2. **Update Browser**: Use latest browser version
3. **Clear Cache**: If experiencing issues, clear browser cache
4. **Mobile Data**: App works on mobile data but WiFi preferred for booking

---

### 🎉 **Your Journey Awaits!**

**Roamy makes travel booking simple:**
1. 🔍 **Discover** amazing destinations
2. 🏨 **Book** hotels and transport easily  
3. 🗺️ **Plan** with AI-powered suggestions
4. 📱 **Manage** all bookings in one place

**Ready to explore the world? Start your journey at the Home page! 🌍✈️**

---

*Happy travels with Roamy! 🏖️*