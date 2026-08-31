/**
 * LGS STARTER — swap these fields, then it's a pitch mock.
 * Open index.html in a browser. No build step.
 *
 * Sample values are obviously placeholders (SHOP_NAME, Your City, CA).
 * Do not ship this file with a real shop's name until you mean to.
 */
window.SHOP = {
  SHOP_NAME: "SHOP_NAME",
  TAGLINE: "Hours, this week's events, pickup at the counter.",
  CITY: "Your City, CA",
  ADDRESS: "123 Placeholder Ave, Your City, CA 00000",
  PHONE: "(555) 010-0140",
  EMAIL: "hello@shop-name.example",
  TIMEZONE: "America/Los_Angeles",

  DISCORD: "https://discord.gg/your-invite",
  FACEBOOK: "https://facebook.com/your-shop",
  INSTAGRAM: "https://instagram.com/your-shop",
  MAPS_URL: "https://www.google.com/maps/search/?api=1&query=Your+City+CA",

  /* Door hours. Keys 0–6 = Sun–Sat. Use null for a closed day.
     Times are 24h strings in TIMEZONE. Displayed as 12h on the site. */
  HOURS: {
    0: { open: "12:00", close: "18:00" },
    1: { open: "12:00", close: "21:00" },
    2: { open: "12:00", close: "21:00" },
    3: { open: "12:00", close: "21:00" },
    4: { open: "12:00", close: "22:00" },
    5: { open: "12:00", close: "23:00" },
    6: { open: "11:00", close: "22:00" }
  },

  /* Recurring weekly events. weekday: 0 Sun … 6 Sat. */
  EVENTS: [
    {
      name: "Commander Night",
      game: "Magic: The Gathering",
      weekday: 3,
      time: "18:30",
      durationMin: 180,
      fee: "Free",
      newPlayerFriendly: true,
      blurb: "Pods at 6:30. Loaner decks at the counter."
    },
    {
      name: "Friday Night Magic",
      game: "Magic: The Gathering",
      weekday: 5,
      time: "19:00",
      durationMin: 180,
      fee: "$10",
      newPlayerFriendly: true,
      blurb: "Standard. Pairings at 7. $10 at the counter."
    },
    {
      name: "Pokémon League",
      game: "Pokémon TCG",
      weekday: 6,
      time: "13:00",
      durationMin: 180,
      fee: "$5",
      newPlayerFriendly: true,
      blurb: "League, then constructed if we have the numbers."
    },
    {
      name: "Lorcana Learn-to-Play",
      game: "Disney Lorcana",
      weekday: 6,
      time: "16:00",
      durationMin: 120,
      fee: "Free",
      newPlayerFriendly: true,
      blurb: "Demo decks at the counter. Pickup games after."
    },
    {
      name: "Sunday Board Game Open",
      game: "Board games",
      weekday: 0,
      time: "13:00",
      durationMin: 240,
      fee: "Free",
      newPlayerFriendly: true,
      blurb: "Library games out. Teaching at the counter if you ask."
    }
  ],

  CARRY: [
    { name: "Magic: The Gathering", note: "Sealed, supplies, and singles by request." },
    { name: "Pokémon", note: "Product and league-legal accessories." },
    { name: "Disney Lorcana", note: "Sealed and learn-to-play decks." },
    { name: "Miniatures", note: "Paints, terrain basics, and a table to build." },
    { name: "Board games", note: "New releases and a play-library shelf." },
    { name: "Singles", note: "Ask at the counter. We'll look it up." }
  ],

  PREORDER_NOTE:
    "Preorder at the counter. We text you when your box is in. Already in the shop? Just grab it.",

  NEW_PLAYERS: {
    kicker: "How nights run",
    title: "Seats, entry, start time.",
    grafs: [
      "Events start at the time on the calendar. Counter takes entry. If we have loaners, they live there too.",
      "Doors match the hours on this page. If Google says something else, this page is right.",
      "Trade and collections by appointment. Preorder and pickup at the counter."
    ]
  },

  POLICY:
    "Collections by appointment. Trade at the counter. We price in person."
};
