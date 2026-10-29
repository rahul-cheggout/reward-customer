import React, { useState, useMemo } from 'react';

const CITIES = [
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International Airport' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhash Chandra Bose Airport' },
  { code: 'GOI', city: 'Goa', name: 'Goa Dabolim / Mopa International Airport' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International Airport' }
];

const FLIGHT_CATALOG = [
  {
    id: 'fl-1',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNum: '6E-2041',
    aircraft: 'A321neo',
    color: '#002e6e',
    logoText: '6E',
    deptTime: '06:00',
    arrTime: '08:15',
    duration: '2h 15m',
    stops: 'Non-stop',
    basePrice: 4250,
    otas: { mmt: 4890, cleartrip: 4750, yatra: 4820 },
    badge: 'Fastest & Best Price',
    multiplier: '5X Points'
  },
  {
    id: 'fl-2',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNum: 'AI-805',
    aircraft: 'B787-8 Dreamliner',
    color: '#d91b24',
    logoText: 'AI',
    deptTime: '08:45',
    arrTime: '11:00',
    duration: '2h 15m',
    stops: 'Non-stop',
    basePrice: 4680,
    otas: { mmt: 5200, cleartrip: 5120, yatra: 5180 },
    badge: 'Complimentary Meal',
    multiplier: '5X Points'
  },
  {
    id: 'fl-3',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNum: 'QP-1302',
    aircraft: 'B737-MAX 8',
    color: '#f95700',
    logoText: 'QP',
    deptTime: '11:20',
    arrTime: '13:40',
    duration: '2h 20m',
    stops: 'Non-stop',
    basePrice: 4120,
    otas: { mmt: 4650, cleartrip: 4580, yatra: 4600 },
    badge: 'Lowest Fare',
    multiplier: '5X Points'
  },
  {
    id: 'fl-4',
    airline: 'Vistara',
    airlineCode: 'UK',
    flightNum: 'UK-945',
    aircraft: 'A320neo',
    color: '#531b3e',
    logoText: 'UK',
    deptTime: '15:30',
    arrTime: '17:45',
    duration: '2h 15m',
    stops: 'Non-stop',
    basePrice: 4950,
    otas: { mmt: 5450, cleartrip: 5390, yatra: 5420 },
    badge: 'Premium Hospitality',
    multiplier: '5X Points'
  },
  {
    id: 'fl-5',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    flightNum: 'SG-8169',
    aircraft: 'B737-800',
    color: '#e01e26',
    logoText: 'SG',
    deptTime: '19:15',
    arrTime: '21:35',
    duration: '2h 20m',
    stops: 'Non-stop',
    basePrice: 4320,
    otas: { mmt: 4790, cleartrip: 4710, yatra: 4760 },
    badge: 'Evening Departure',
    multiplier: '5X Points'
  }
];

export function FlightCompareWidget({ userPoints = 45200, onSelectFlight }) {
  const [tripType, setTripType] = useState('oneWay'); // 'oneWay' | 'roundTrip'
  const [fromCode, setFromCode] = useState('DEL');
  const [toCode, setToCode] = useState('BOM');
  const [deptDate, setDeptDate] = useState('2026-10-31');
  const [returnDate, setReturnDate] = useState('2026-11-04');
  const [travellers, setTravellers] = useState('1 Adult, Economy');
  const [specialFare, setSpecialFare] = useState('regular'); // 'regular' | 'armed' | 'senior' | 'student'
  
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('price-low'); // 'price-low' | 'fastest' | 'dept-early'
  const [pointsRedeemPercent, setPointsRedeemPercent] = useState(70); // up to 70% in points
  const [isSearching, setIsSearching] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Swap From / To
  const handleSwapAirports = () => {
    setIsSwapping(true);
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const fromCityObj = CITIES.find((c) => c.code === fromCode) || CITIES[0];
  const toCityObj = CITIES.find((c) => c.code === toCode) || CITIES[1];

  // Filter & sort flight results
  const filteredFlights = useMemo(() => {
    let list = [...FLIGHT_CATALOG];
    if (selectedAirlineFilter !== 'ALL') {
      list = list.filter((f) => f.airline.toLowerCase().includes(selectedAirlineFilter.toLowerCase()));
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'fastest') {
      list.sort((a, b) => a.duration.localeCompare(b.duration));
    } else if (sortBy === 'dept-early') {
      list.sort((a, b) => a.deptTime.localeCompare(b.deptTime));
    }

    return list;
  }, [selectedAirlineFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 450);
  };

  return (
    <div className="flight-compare-container">
      {/* Search Header Banner */}
      <div className="travel-hero-strip">
        <div className="travel-hero-content">
          <div className="travel-hero-tag">
            <span className="material-icons">flight_takeoff</span>
            <span>IOB SmartTravel Booking Engine</span>
          </div>
          <h1 className="travel-hero-heading">Compare &amp; Book Flights with IOB Reward Points</h1>
          <p className="travel-hero-sub">
            Real-time comparison across MakeMyTrip, Cleartrip &amp; Yatra. Pay up to 70% in Reward Points with Best Price Guarantee.
          </p>
        </div>
        <div className="travel-hero-badge">
          <div className="travel-points-pill">
            <span className="material-icons">stars</span>
            <div>
              <span className="lbl">Available to Redeem</span>
              <strong className="val">{(userPoints || 0).toLocaleString('en-IN')} Pts</strong>
              <span className="eqv">≈ ₹{((userPoints || 0) * 0.25).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Box */}
      <div className="flight-search-box">
        {/* Trip Type Tabs */}
        <div className="trip-tabs-row">
          <div className="trip-tabs-group">
            <button
              type="button"
              className={`trip-tab-btn ${tripType === 'oneWay' ? 'active' : ''}`}
              onClick={() => setTripType('oneWay')}
            >
              <span className="material-icons">arrow_forward</span>
              One Way
            </button>
            <button
              type="button"
              className={`trip-tab-btn ${tripType === 'roundTrip' ? 'active' : ''}`}
              onClick={() => setTripType('roundTrip')}
            >
              <span className="material-icons">sync_alt</span>
              Round Trip
            </button>
            <button
              type="button"
              className={`trip-tab-btn ${tripType === 'multi' ? 'active' : ''}`}
              onClick={() => setTripType('multi')}
            >
              <span className="material-icons">alt_route</span>
              Multi-City
            </button>
          </div>

          <div className="flight-offer-pill">
            <span className="badge-flame">5X</span>
            <span>Earn 5X Reward Points on Flight Bookings</span>
          </div>
        </div>

        {/* Airport & Date Grid */}
        <form onSubmit={handleSearchSubmit} className="flight-search-form">
          <div className="search-grid-wrap">
            {/* FROM */}
            <div className="search-cell from-cell">
              <span className="cell-label">FROM</span>
              <div className="cell-content">
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  className="airport-select"
                >
                  {CITIES.map((c) => (
                    <option key={c.code} value={c.code} disabled={c.code === toCode}>
                      {c.city} ({c.code}) - {c.name}
                    </option>
                  ))}
                </select>
                <div className="cell-display">
                  <span className="city-title">{fromCityObj.city}</span>
                  <span className="airport-meta">{fromCityObj.code}, {fromCityObj.name}</span>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              className={`swap-btn ${isSwapping ? 'is-spinning' : ''}`}
              onClick={handleSwapAirports}
              title="Swap origin and destination"
              aria-label="Swap airports"
            >
              <span className="material-icons">swap_horiz</span>
            </button>

            {/* TO */}
            <div className="search-cell to-cell">
              <span className="cell-label">TO</span>
              <div className="cell-content">
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  className="airport-select"
                >
                  {CITIES.map((c) => (
                    <option key={c.code} value={c.code} disabled={c.code === fromCode}>
                      {c.city} ({c.code}) - {c.name}
                    </option>
                  ))}
                </select>
                <div className="cell-display">
                  <span className="city-title">{toCityObj.city}</span>
                  <span className="airport-meta">{toCityObj.code}, {toCityObj.name}</span>
                </div>
              </div>
            </div>

            {/* DEPARTURE */}
            <div className="search-cell date-cell">
              <span className="cell-label">DEPARTURE</span>
              <div className="cell-content">
                <input
                  type="date"
                  value={deptDate}
                  min="2026-10-29"
                  onChange={(e) => setDeptDate(e.target.value)}
                  className="native-date-input"
                />
                <div className="cell-display">
                  <span className="date-title">
                    {new Date(deptDate).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                  <span className="airport-meta">{new Date(deptDate).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* RETURN */}
            {tripType === 'roundTrip' && (
              <div className="search-cell date-cell">
                <span className="cell-label">RETURN</span>
                <div className="cell-content">
                  <input
                    type="date"
                    value={returnDate}
                    min={deptDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="native-date-input"
                  />
                  <div className="cell-display">
                    <span className="date-title">
                      {new Date(returnDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                    <span className="airport-meta">{new Date(returnDate).getFullYear()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TRAVELLERS & CLASS */}
            <div className="search-cell pax-cell">
              <span className="cell-label">TRAVELLERS &amp; CLASS</span>
              <div className="cell-content">
                <select
                  value={travellers}
                  onChange={(e) => setTravellers(e.target.value)}
                  className="airport-select"
                >
                  <option value="1 Adult, Economy">1 Adult, Economy</option>
                  <option value="2 Adults, Economy">2 Adults, Economy</option>
                  <option value="1 Adult, Premium Economy">1 Adult, Premium Economy</option>
                  <option value="1 Adult, Business">1 Adult, Business Class</option>
                </select>
                <div className="cell-display">
                  <span className="city-title">{travellers.split(',')[0]}</span>
                  <span className="airport-meta">{travellers.split(',')[1] || 'Economy'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Fares Row */}
          <div className="special-fares-row">
            <span className="special-fare-label">Special Fares:</span>
            <div className="special-fare-chips">
              <label className={`fare-chip ${specialFare === 'regular' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="specialFare"
                  value="regular"
                  checked={specialFare === 'regular'}
                  onChange={() => setSpecialFare('regular')}
                />
                <span>Regular Fares</span>
              </label>

              <label className={`fare-chip ${specialFare === 'armed' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="specialFare"
                  value="armed"
                  checked={specialFare === 'armed'}
                  onChange={() => setSpecialFare('armed')}
                />
                <span className="material-icons-mini">military_tech</span>
                <span>Armed Forces</span>
                <span className="chip-discount">Up to ₹600 Off</span>
              </label>

              <label className={`fare-chip ${specialFare === 'senior' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="specialFare"
                  value="senior"
                  checked={specialFare === 'senior'}
                  onChange={() => setSpecialFare('senior')}
                />
                <span className="material-icons-mini">elderly</span>
                <span>Senior Citizen</span>
                <span className="chip-discount">Up to ₹500 Off</span>
              </label>

              <label className={`fare-chip ${specialFare === 'student' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="specialFare"
                  value="student"
                  checked={specialFare === 'student'}
                  onChange={() => setSpecialFare('student')}
                />
                <span className="material-icons-mini">school</span>
                <span>Student</span>
                <span className="chip-discount">+10kg Baggage</span>
              </label>
            </div>
          </div>

          {/* Points Calculator Bar */}
          <div className="points-redeem-calc-bar">
            <div className="calc-left">
              <span className="calc-icon material-icons">account_balance_wallet</span>
              <div>
                <span className="calc-title">IOB Points Redemption Ratio</span>
                <p className="calc-desc">Pay up to 70% of total booking value with Points (1 Point = ₹0.25)</p>
              </div>
            </div>

            <div className="calc-slider-wrap">
              <div className="slider-labels">
                <span>0% Points</span>
                <span className="active-slider-val">{pointsRedeemPercent}% in Points</span>
                <span>70% Max</span>
              </div>
              <input
                type="range"
                min="0"
                max="70"
                step="10"
                value={pointsRedeemPercent}
                onChange={(e) => setPointsRedeemPercent(Number(e.target.value))}
                className="points-slider"
              />
            </div>

            <button type="submit" className="search-flights-btn" disabled={isSearching}>
              <span className="material-icons">{isSearching ? 'autorenew' : 'search'}</span>
              <span>{isSearching ? 'Searching…' : 'Search Flights'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comparison Engine Results */}
      <div className="flight-results-section">
        {/* Results Bar & Filters */}
        <div className="results-control-bar">
          <div className="flight-route-summary">
            <h3>
              {fromCityObj.city} ({fromCityObj.code}) ➔ {toCityObj.city} ({toCityObj.code})
            </h3>
            <span className="summary-date">
              {new Date(deptDate).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })} • {filteredFlights.length} Flights Available
            </span>
          </div>

          {/* Airline Filter Pills */}
          <div className="airline-filter-pills">
            {['ALL', 'IndiGo', 'Air India', 'Akasa Air', 'Vistara', 'SpiceJet'].map((al) => (
              <button
                key={al}
                type="button"
                className={`filter-pill ${selectedAirlineFilter === al ? 'active' : ''}`}
                onClick={() => setSelectedAirlineFilter(al)}
              >
                {al}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="sort-selector">
            <span className="sort-lbl">Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price-low">Cheapest First</option>
              <option value="fastest">Fastest Flight</option>
              <option value="dept-early">Earliest Departure</option>
            </select>
          </div>
        </div>

        {/* Live Comparison Table / Cards */}
        <div className="flight-cards-list">
          {filteredFlights.map((flight) => {
            // Calculate Points vs Cash split
            const totalCash = flight.basePrice;
            const pointsValueRs = Math.round((totalCash * pointsRedeemPercent) / 100);
            const pointsNeeded = Math.round(pointsValueRs / 0.25);
            const balanceCash = totalCash - pointsValueRs;

            return (
              <div key={flight.id} className="flight-card">
                {/* Airline & Aircraft */}
                <div className="flight-airline-col">
                  <div className="airline-badge" style={{ backgroundColor: flight.color }}>
                    <span>{flight.logoText}</span>
                  </div>
                  <div>
                    <h4 className="airline-name">{flight.airline}</h4>
                    <span className="flight-code">{flight.flightNum} • {flight.aircraft}</span>
                  </div>
                </div>

                {/* Timing & Route */}
                <div className="flight-time-col">
                  <div className="time-block dept">
                    <span className="time-val">{flight.deptTime}</span>
                    <span className="airport-code">{fromCode}</span>
                  </div>

                  <div className="duration-block">
                    <span className="duration-txt">{flight.duration}</span>
                    <div className="flight-line">
                      <span className="flight-dot start" />
                      <span className="flight-path" />
                      <span className="material-icons plane-icon">flight</span>
                      <span className="flight-dot end" />
                    </div>
                    <span className="stops-txt">{flight.stops}</span>
                  </div>

                  <div className="time-block arr">
                    <span className="time-val">{flight.arrTime}</span>
                    <span className="airport-code">{toCode}</span>
                  </div>
                </div>

                {/* OTA Market Comparison Box */}
                <div className="ota-comparison-col">
                  <span className="ota-heading">Market Live Rates:</span>
                  <div className="ota-rates-list">
                    <div className="ota-item">
                      <span className="ota-name">MakeMyTrip</span>
                      <span className="ota-val">₹{flight.otas.mmt.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="ota-item">
                      <span className="ota-name">Cleartrip</span>
                      <span className="ota-val">₹{flight.otas.cleartrip.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="ota-item">
                      <span className="ota-name">Yatra</span>
                      <span className="ota-val">₹{flight.otas.yatra.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <span className="lowest-guarantee-badge">
                    <span className="material-icons">verified</span> Best Fare on IOB
                  </span>
                </div>

                {/* Price & Book Action */}
                <div className="flight-action-col">
                  {flight.badge && (
                    <span className="flight-tag-ribbon">{flight.badge}</span>
                  )}

                  <div className="price-display-wrap">
                    <div className="fare-points-row">
                      <span className="final-price">₹{flight.basePrice.toLocaleString('en-IN')}</span>
                      <span className="or-divider">OR</span>
                    </div>

                    {pointsRedeemPercent > 0 ? (
                      <div className="points-split-preview">
                        <span className="points-highlight">
                          {pointsNeeded.toLocaleString('en-IN')} Pts
                        </span>
                        <span className="cash-balance-txt">
                          + ₹{balanceCash.toLocaleString('en-IN')} on Card
                        </span>
                      </div>
                    ) : (
                      <div className="points-split-preview">
                        <span className="points-highlight">
                          {(flight.basePrice / 0.25).toLocaleString('en-IN')} Pts
                        </span>
                        <span className="cash-balance-txt">100% with Points</span>
                      </div>
                    )}
                  </div>

                  <div className="reward-multiplier-tag">
                    <span className="material-icons">bolt</span>
                    <span>{flight.multiplier} Earned</span>
                  </div>

                  <button
                    type="button"
                    className="book-flight-btn"
                    onClick={() => onSelectFlight && onSelectFlight({
                      ...flight,
                      fromCity: fromCityObj.city,
                      fromCode,
                      toCity: toCityObj.city,
                      toCode,
                      date: deptDate,
                      pointsNeeded,
                      balanceCash,
                      travellers
                    })}
                  >
                    <span>Book with Points</span>
                    <span className="material-icons">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Benefits Footer Strip */}
      <div className="travel-perks-strip">
        <div className="perk-card">
          <div className="perk-icon-wrap">
            <span className="material-icons">currency_rupee</span>
          </div>
          <div>
            <h4>100% Value Guarantee</h4>
            <p>1 IOB Point = ₹0.25 guaranteed redemption value across domestic &amp; international airlines.</p>
          </div>
        </div>

        <div className="perk-card">
          <div className="perk-icon-wrap">
            <span className="material-icons">money_off</span>
          </div>
          <div>
            <h4>Zero Convenience Fee</h4>
            <p>Save flat ₹350 - ₹500 convenience fee per passenger exclusively for IOB Cardholders.</p>
          </div>
        </div>

        <div className="perk-card">
          <div className="perk-icon-wrap">
            <span className="material-icons">history_toggle_off</span>
          </div>
          <div>
            <h4>Instant Cancellation &amp; Refund</h4>
            <p>Direct points credit back to your IOB Credit Card reward pool within 15 minutes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
